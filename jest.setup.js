// jest.setup.js
require('@testing-library/jest-dom');

// Mock para TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;