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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Replace with the actual hashed password from your database
const storedHashedPassword = '$2a$10$AdBqrU3VoxnBqtQWyKjv2e4KrLfhxXZ/0ScLYA5ErQ4OnLUYFUKmS';
// Replace with the password you want to verify
const inputPassword = '12345678';
function verifyPassword() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isMatch = yield bcryptjs_1.default.compare(inputPassword, storedHashedPassword);
            if (isMatch) {
                console.log('Password matches!');
            }
            else {
                console.log('Password does not match.');
            }
        }
        catch (error) {
            console.error('Error during password verification:', error);
        }
    });
}
verifyPassword();
