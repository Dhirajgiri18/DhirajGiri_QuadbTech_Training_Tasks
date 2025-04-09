module lending_borrowing::borrowing {
    use std::signer;

    struct Borrower has key {
        borrowed: u64,
    }

    public entry fun borrow_funds(account: &signer, amount: u64) {
        move_to(account, Borrower { borrowed: amount });
    }

    public fun get_borrowed_amount(account: &signer): u64 acquires Borrower{
        borrow_global<Borrower>(signer::address_of(account)).borrowed
    }
}
