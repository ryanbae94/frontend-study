import _Promise from './Promise';
import { describe, expect, test } from '@jest/globals';

describe('Promise 메서드 모킹 테스트', () => {
	// 생성 및 기본 상태 테스트
	test('Promise가 올바르게 생성되고 초기 상태는 pending이다', () => {
		const promise = new _Promise(() => {});
		expect((promise as any).state).toBe('pending');
		expect((promise as any).value).toBe(null);
		expect((promise as any).rejectedReason).toBe(null);
	});

	// resolve 테스트
	test('Promise는 resolve 함수 호출 시 fulfilled 상태로 변경된다', () => {
		const testValue = 'test value';
		const promise = new _Promise<string>((resolve) => {
			resolve(testValue);
		});

		expect((promise as any).state).toBe('fulfilled');
		expect((promise as any).value).toBe(testValue);
	});

	// reject 테스트
	test('Promise는 reject 함수 호출 시 rejected 상태로 변경된다', () => {
		const errorMessage = 'test error';
		const promise = new _Promise<string>((_, reject) => {
			reject(errorMessage);
		});

		expect((promise as any).state).toBe('rejected');
		expect((promise as any).rejectedReason).toBe(errorMessage);
	});

	// 비동기 resolve 테스트
	test('Promise는 비동기적으로 resolve 될 수 있다', (done) => {
		const testValue = 'async test value';
		const promise = new _Promise<string>((resolve) => {
			setTimeout(() => {
				resolve(testValue);
				expect((promise as any).state).toBe('fulfilled');
				expect((promise as any).value).toBe(testValue);
				done();
			}, 100);
		});

		expect((promise as any).state).toBe('pending');
	});

	// 비동기 reject 테스트
	test('Promise는 비동기적으로 reject 될 수 있다', (done) => {
		const errorMessage = 'async test error';
		const promise = new _Promise<string>((_, reject) => {
			setTimeout(() => {
				reject(errorMessage);
				expect((promise as any).state).toBe('rejected');
				expect((promise as any).rejectedReason).toBe(errorMessage);
				done();
			}, 100);
		});

		expect((promise as any).state).toBe('pending');
	});

	// 에러 처리 테스트
	test('Promise 콜백 내 에러는 자동으로 reject된다', () => {
		const errorMessage = 'execution error';
		const promise = new _Promise<string>(() => {
			throw new Error(errorMessage);
		});

		expect((promise as any).state).toBe('rejected');
		expect((promise as any).rejectedReason).toBeInstanceOf(Error);
		expect((promise as any).rejectedReason.message).toBe(errorMessage);
	});

	// 상태 변경 불가 테스트
	test('Promise는 한번 fulfilled되면 상태가 변경되지 않는다', () => {
		const promise = new _Promise<string>((resolve, reject) => {
			resolve('first');
			resolve('second');
			reject('error');
		});

		expect((promise as any).state).toBe('fulfilled');
		expect((promise as any).value).toBe('first');
		expect((promise as any).rejectedReason).toBe(null);
	});

	test('Promise는 한번 rejected되면 상태가 변경되지 않는다', () => {
		const promise = new _Promise<string>((resolve, reject) => {
			reject('first error');
			reject('second error');
			resolve('value');
		});

		expect((promise as any).state).toBe('rejected');
		expect((promise as any).value).toBe(null);
		expect((promise as any).rejectedReason).toBe('first error');
	});
});
