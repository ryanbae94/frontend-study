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
}

export default _Promise;
