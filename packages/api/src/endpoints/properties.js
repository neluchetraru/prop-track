"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPropertyEndpoints = void 0;
const createPropertyEndpoints = ({ fetcher, baseURL }) => ({
    list: () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetcher(`/properties`, {
            method: "GET",
            baseURL,
        });
        if (response.status === 'error') {
            throw new Error(response.message);
        }
        return response.data;
    }),
    create: (property) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetcher(`/properties`, {
            method: "POST",
            body: property,
            baseURL,
        });
        if (response.status === 'error') {
            throw new Error(response.message);
        }
        return response.data;
    }),
    get: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetcher(`/properties/${id}`, {
            method: "GET",
            baseURL,
        });
        if (response.status === 'error') {
            throw new Error(response.message);
        }
        return response.data;
    }),
    update: (id, property) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetcher(`/properties/${id}`, {
            method: "PATCH",
            body: property,
            baseURL,
        });
        if (response.status === 'error') {
            throw new Error(response.message);
        }
        return response.data;
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetcher(`/properties/${id}`, {
            method: "DELETE",
            baseURL,
        });
        if (response.status === 'error') {
            throw new Error(response.message);
        }
    }),
});
exports.createPropertyEndpoints = createPropertyEndpoints;
