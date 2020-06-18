"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// Routes
const todos_1 = __importDefault(require("./routes/todos"));
const app = express_1.default();
// Config
app.use(body_parser_1.default.json());
// Routes
app.use(todos_1.default);
app.listen(8080);
