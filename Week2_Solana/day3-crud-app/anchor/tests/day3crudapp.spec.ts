import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Day3crudapp } from '../target/types/day3crudapp'

describe('day3crudapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Day3crudapp as Program<Day3crudapp>

  const day3crudappKeypair = Keypair.generate()

  it('Initialize Day3crudapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        day3crudapp: day3crudappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([day3crudappKeypair])
      .rpc()

    const currentCount = await program.account.day3crudapp.fetch(day3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Day3crudapp', async () => {
    await program.methods.increment().accounts({ day3crudapp: day3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.day3crudapp.fetch(day3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Day3crudapp Again', async () => {
    await program.methods.increment().accounts({ day3crudapp: day3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.day3crudapp.fetch(day3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Day3crudapp', async () => {
    await program.methods.decrement().accounts({ day3crudapp: day3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.day3crudapp.fetch(day3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set day3crudapp value', async () => {
    await program.methods.set(42).accounts({ day3crudapp: day3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.day3crudapp.fetch(day3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the day3crudapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        day3crudapp: day3crudappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.day3crudapp.fetchNullable(day3crudappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
