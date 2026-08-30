import { diffProps } from '../diffProps';

describe('diffProps', () => {
  it('returns an empty object when there is no previous snapshot', () => {
    expect(diffProps(undefined, { a: 1 })).toEqual({});
  });

  it('returns an empty object when nothing changed', () => {
    expect(diffProps({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toEqual({});
  });

  it('reports changed keys with their old and new values', () => {
    expect(diffProps({ a: 1, b: 'x' }, { a: 2, b: 'x' })).toEqual({
      a: { from: 1, to: 2 },
    });
  });

  it('reports a key that was added', () => {
    expect(diffProps({ a: 1 }, { a: 1, b: 'new' })).toEqual({
      b: { from: undefined, to: 'new' },
    });
  });

  it('reports a key that was removed', () => {
    expect(diffProps({ a: 1, b: 'gone' }, { a: 1 })).toEqual({
      b: { from: 'gone', to: undefined },
    });
  });
});
