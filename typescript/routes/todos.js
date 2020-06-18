"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const express_1 = require("express");
let todos = [];
const router = express_1.Router();
// GET
router.get('/', (req, res) => {
    res.status(200).json({
        todos: todos
    });
});
// POST
router.post('/', (req, res) => {
    if (!req.body.text) {
        const error = new Error('Missing text');
        throw error;
    }
    const newTodo = {
        id: new Date().toDateString(),
        text: req.body.text
    };
    todos.push(newTodo);
    res.status(201).json({
        message: 'Todo added',
        todos: todos
    });
});
// PUT
router.put('/todo/:id', (req, res) => {
    const id = req.params.id;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (!todoIndex || todoIndex < 0) {
        res.status(404).json({
            message: 'Could not found todo'
        });
        return;
    }
    todos[todoIndex] = { id: todos[todoIndex].id, text: req.body.text };
    res.status(200).json({
        message: 'Updated todo item',
        todos: todos
    });
});
// DELETE
router.delete('todo/:id', (req, res) => {
    const id = req.params.id;
    todos = todos.filter(todo => todo.id !== id);
    res.status(200).json({
        message: 'Todo was deleted',
        todos: todos
    });
});
exports.default = express_1.Router;
