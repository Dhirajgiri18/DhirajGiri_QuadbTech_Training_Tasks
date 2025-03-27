use anchor_lang::prelude::*;

declare_id!("Agf8vszsxsqPkL7qxJpQmtqfH4JkRCykJVQYMMAbcxtu");

#[program]
pub mod day2_hello_solana {
    use super::*;

    pub fn say_hello(ctx: Context<SayHello>) -> Result<()> {
        msg!("Hello Solana!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SayHello {}
