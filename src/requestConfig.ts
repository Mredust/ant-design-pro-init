﻿import type {RequestOptions} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {message} from 'antd';


// 与后端约定的响应数据格式
interface ResponseStructure {
    code: number;
    data: any;
    msg: string;
}

export const requestConfig: RequestConfig = {
    // base
    baseURL: 'http://localhost:4090',
    withCredentials: true,
    timeout: 300000,

    // 请求拦截器
    requestInterceptors: [
        (config: RequestOptions) => {
            // 拦截请求配置，进行个性化处理。
            return {...config};
        },
    ],

    // 响应拦截器
    responseInterceptors: [
        (response) => {
            // 拦截响应数据，进行个性化处理
            const {data} = response as unknown as ResponseStructure;

            if (data?.success === false) {
                message.error('请求失败！');
            }
            return response;
        },
    ],

    // 错误处理
    errorConfig: {
        // 错误抛出
        errorThrower: (res) => {
            const {code, msg} =
                res as unknown as ResponseStructure;
            if (code !== 200) {
                const error: any = new Error(msg);
                error.name = 'BizError';
                error.info = {code: msg};
                throw error; // 抛出自制的错误
            }
        },
        // 错误接收及处理
        errorHandler: (error: any, opts: any) => {
            if (opts?.skipErrorHandler) throw error;
            // 我们的 errorThrower 抛出的错误。
            if (error.name === 'BizError') {
                const errorInfo: ResponseStructure | undefined = error.info;
                if (errorInfo) {
                    const {msg} = errorInfo;
                    message.error(msg)
                }
            } else if (error.response) {
                // Axios 的错误
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                message.error(`Response status:${error.response.status}`);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                message.error('None response! Please retry.');
            } else {
                // 发送请求时出了点问题
                message.error('Request error, please retry.');
            }
        },
    },
};
