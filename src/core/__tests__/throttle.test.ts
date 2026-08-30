import { createRateLimiter } from '../throttle';

describe('createRateLimiter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('always allows the first emission', () => {
    const limiter = createRateLimiter();
    expect(limiter.shouldEmit(1000)).toBe(true);
  });

  it('suppresses a second call within the throttle window', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    const limiter = createRateLimiter();

    expect(limiter.shouldEmit(500)).toBe(true);

    jest.spyOn(Date, 'now').mockReturnValue(1200); // 200ms later, still within 500ms
    expect(limiter.shouldEmit(500)).toBe(false);
  });

  it('allows another emission once the window has passed', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    const limiter = createRateLimiter();

    expect(limiter.shouldEmit(500)).toBe(true);

    jest.spyOn(Date, 'now').mockReturnValue(1600); // 600ms later, past the window
    expect(limiter.shouldEmit(500)).toBe(true);
  });

  it('always emits when throttleMs is 0', () => {
    const limiter = createRateLimiter();

    expect(limiter.shouldEmit(0)).toBe(true);
    expect(limiter.shouldEmit(0)).toBe(true);
    expect(limiter.shouldEmit(0)).toBe(true);
  });
});
