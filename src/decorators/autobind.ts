// autobind decorator
export function autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    return {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        }
    };
}
