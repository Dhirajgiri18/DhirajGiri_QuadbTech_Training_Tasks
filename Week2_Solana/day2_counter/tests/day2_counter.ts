import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";

describe("counter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;
  const counterKeypair = anchor.web3.Keypair.generate();

  before(async () => {
    await program.methods.initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([counterKeypair])
      .rpc();
  });

  it("Increments counter", async () => {
    await program.methods.increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const counter = await program.account.counter.fetch(counterKeypair.publicKey);
    console.log("Count after increment:", counter.count.toString());
  });

  it("Decrements counter", async () => {
    await program.methods.decrement()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const counter = await program.account.counter.fetch(counterKeypair.publicKey);
    console.log("Count after decrement:", counter.count.toString());
  });
});