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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const logger_1 = __importDefault(require("./config/logger"));
// Initialize Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome to muldocs.ai");
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
app.get("/error", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const err = (0, http_errors_1.default)(401, "Hey, you don't have permission to access this page");
    return next(err);
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        logger_1.default.error(err.message);
        const statusCode = err.statusCode || err.status || 500;
        res.status(statusCode).json({
            error: [
                {
                    type: err.name,
                    msg: err.message,
                    path: "",
                    location: "",
                },
            ],
        });
    }
});
exports.default = app;
