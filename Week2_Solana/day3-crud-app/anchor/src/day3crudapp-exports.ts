// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Day3crudappIDL from '../target/idl/day3crudapp.json'
import type { Day3crudapp } from '../target/types/day3crudapp'

// Re-export the generated IDL and type
export { Day3crudapp, Day3crudappIDL }

// The programId is imported from the program IDL.
export const DAY3CRUDAPP_PROGRAM_ID = new PublicKey(Day3crudappIDL.address)

// This is a helper function to get the Day3crudapp Anchor program.
export function getDay3crudappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Day3crudappIDL, address: address ? address.toBase58() : Day3crudappIDL.address } as Day3crudapp, provider)
}

// This is a helper function to get the program ID for the Day3crudapp program depending on the cluster.
export function getDay3crudappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Day3crudapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return DAY3CRUDAPP_PROGRAM_ID
  }
}
