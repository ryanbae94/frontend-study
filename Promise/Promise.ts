type PromiseState = 'pending' | 'fulfilled' | 'rejected';
type Resolver<T> = (value: T) => void;
type Rejector = (rejectedReason: any) => void;
type PromiseCallback<T> = (resolve: Resolver<T>, reject: Rejector) => void;

class _Promise<T> {
	private state: PromiseState = 'pending';
	private value: T | null = null;
	private rejectedReason = null;

	constructor(promiseCallback: PromiseCallback<T>) {
		try {
			promiseCallback(this.resolve, this.reject);
		} catch (error) {
			this.reject(error);
		}
	}

	private resolve: Resolver<T> = (value: T) => {
		if (this.state !== 'pending') return;

		this.state = 'fulfilled';
		this.value = value;
	};

	private reject: Rejector = (rejectedReason) => {
		if (this.state !== 'pending') return;

		this.state = 'rejected';
		this.rejectedReason = rejectedReason;
	};

	static resolve<T>(value: T): _Promise<T> {
		if (value instanceof _Promise) {
			return value;
		}

		return new _Promise<T>((resolve) => {
			resolve(value);
		});
	}

	static reject<T>(rejectedReason: any): _Promise<T> {
		return new _Promise<T>((_, reject) => {
			reject(rejectedReason);
		});
	}
}

export default _Promise;
