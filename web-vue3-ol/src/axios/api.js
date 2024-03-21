// src/axios/api.js
import service from "./request";

// 登录
export const Login = (data) => {
  return service({
    url: "/login",
    method: "post",
    data,
  });
};

// Get请求
export const Get = (url, data) => {
  return service({
    url,
    method: "get",
    params: data,
  });
};

// Delete请求
export const Delete = (url) => {
  return service({
    url,
    method: "delete",
  });
};

// Post请求
export const Post = (url, data) => {
  return service({
    url,
    method: "post",
    data,
  });
};

// 上传文件请求
export const PostFile = (url, data, onUploadProgress) => {
  return service({
    url,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

// Put请求
export const Put = (url, data) => {
  return service({
    url,
    method: "put",
    data,
  });
};

// Patch请求
export const Patch = (url, data) => {
  return service({
    url,
    method: "patch",
    data,
  });
};
