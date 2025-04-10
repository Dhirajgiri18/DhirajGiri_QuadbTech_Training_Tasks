module gas_refund_demo::gas_refund_demo {

    use std::signer;
    use std::vector;

    struct State has key {
        data: vector<u8>,
    }

    public entry fun create_state(account: &signer) {
    let data = vector::singleton(97); // immutable
    let data_ref = &mut data;         // mutable reference

    vector::push_back(data_ref, 98);
    vector::push_back(data_ref, 99);
    vector::push_back(data_ref, 100);
    vector::push_back(data_ref, 101);

    move_to(account, State {
        data,
    });
}





    public entry fun delete_state(account: &signer) acquires State {
    let state = move_from<State>(signer::address_of(account));
    let State { data: _ } = state;
}



    public fun check_state(addr: address): bool {
        exists<State>(addr)
    }
}
