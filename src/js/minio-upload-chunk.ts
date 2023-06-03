import axios, { Axios } from "axios";
import { minioPreSignUrl } from "../api/upload";

export class UploadChunk {
  client: Axios;
  file: File;
  progress: number;
  chunkNumber: number;
  isStop: boolean;
  chunkSize: number;
  chunkIndex: number;
  uploadId: string;
  filename: string;

  onError: ((err: string) => void | undefined) | undefined;
  onSuccess: (() => void | undefined) | undefined;
  onRetry: (() => void | undefined) | undefined;
  onProgress: ((progress: number) => void) | undefined;

  constructor(file: File, uploadId: string, filename: string) {
    this.client = axios.create({
      timeout: 15000,
      withCredentials: false,
    });
    this.file = file;
    this.progress = 0;
    this.isStop = false;
    this.chunkIndex = 1;
    this.chunkSize = 6 * 1024 * 1024;
    this.chunkNumber = Math.ceil(file.size / this.chunkSize);

    this.uploadId = uploadId;
    this.filename = filename;
  }

  on(event: string, handle: any) {
    if (event === "error") {
      this.onError = handle;
    } else if (event === "success") {
      this.onSuccess = handle;
    } else if (event === "progress") {
      this.onProgress = handle;
    } else if (event === "retry") {
      this.onRetry = handle;
    }
  }

  start() {
    if (this.isStop) {
      return;
    }
    if (this.chunkIndex > this.chunkNumber) {
      //Upload完成
      this.onSuccess && this.onSuccess();
      return;
    }
    this.onProgress &&
      this.onProgress(
        parseInt((this.chunkIndex / this.chunkNumber) * 100 + "")
      );

    let start = (this.chunkIndex - 1) * this.chunkSize;
    const chunkData = this.file.slice(start, start + this.chunkSize);
    const boolname = this.file.name + "-" + this.chunkIndex;
    const tmpFile = new File([chunkData], boolname);

    minioPreSignUrl(this.uploadId, this.filename, this.chunkIndex)
      .then((res: any) => {
        return this.client.put(res.data.url, tmpFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .then(() => {
        this.chunkIndex += 1;
        this.start();
      })
      .catch((e) => {
        console.error("文件分片Upload失败", e);
        this.onError && this.onError("失败.2");
      });
  }

  cancel() {
    this.isStop = true;
    this.onError && this.onError("已Cancel");
  }

  retry() {
    this.isStop = false;
    this.start();
    this.onRetry && this.onRetry();
  }
}
