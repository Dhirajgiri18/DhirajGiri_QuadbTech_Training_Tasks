use anchor_lang::prelude::*;

declare_id!("8AJgXdqT8B48SFqBVHp3ykmbPvc2su13RB2JPpUswV3e");

#[program]
pub mod day1_task1_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
