import { create } from 'ipfs-http-client'
import process from 'process'

const IPFS_HOST = process.env.IPFS_HOST || 'localhost'
const IPFS_PORT = process.env.IPFS_PORT || '5001'

const ipfs = create({
  host: IPFS_HOST,
  port: IPFS_PORT,
  protocol: 'http'
})

export default ipfs