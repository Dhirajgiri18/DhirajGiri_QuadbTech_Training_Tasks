module lending_borrowing::lending {
    use std::signer;
    use std::coin;
    use 0x1::aptos_coin::AptosCoin;

    struct Lender has key {
        amount: u64,
    }

    public entry fun deposit_funds(account: &signer, amount: u64) {
        let coin = coin::withdraw<AptosCoin>(account, amount);
        move_to(account, Lender { amount });
        coin::deposit<AptosCoin>(signer::address_of(account), coin); 
    }

    // No `view`, no signer - works as a read-only function
        public fun get_lending_amount(account: address): u64 acquires Lender {
        borrow_global<Lender>(account).amount
    }

}
