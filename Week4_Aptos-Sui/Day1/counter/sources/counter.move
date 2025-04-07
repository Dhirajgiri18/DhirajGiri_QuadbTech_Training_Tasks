module 0xffc80801f9b18850e76832175cb2e3b7941eebf550e6ddfee7d8f5f2685d6988::counter {

    use std::signer;

    struct Counter has key {
        value: u64,
    }

    public fun initialize(account: &signer) {
        move_to(account, Counter { value: 0 });
    }

    public fun increment(account: &signer) acquires Counter {
        let counter = borrow_global_mut<Counter>(signer::address_of(account));
        counter.value = counter.value + 1;
    }

    public fun get(account: address): u64 acquires Counter {
        borrow_global<Counter>(account).value
    }
}
