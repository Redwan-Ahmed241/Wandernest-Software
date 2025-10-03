// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.scrollTo for tests since JSDOM doesn't implement it
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock HTMLCanvasElement.getContext for tests
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  toDataURL: jest.fn(() => 'data:image/png;base64,'),
})) as jest.Mock;

// Mock IntersectionObserver if needed
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;
window.IntersectionObserver.prototype.observe = jest.fn();
window.IntersectionObserver.prototype.unobserve = jest.fn();
window.IntersectionObserver.prototype.disconnect = jest.fn();
