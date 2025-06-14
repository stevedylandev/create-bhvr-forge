import type { TemplateInfo } from "../types";

export const TEMPLATES: Record<string, TemplateInfo> = {
  default: {
    branch: "main",
    description: "Basic setup with Bun, Hono, Vite and React",
  },
  tailwind: { branch: "tailwindcss", description: "Basic setup + TailwindCSS" },
  shadcn: {
    branch: "shadcn-ui",
    description: "Basic setup + TailwindCSS + shadcn/ui",
  },
};

export const honoRpcTemplate = `import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { createTestClient, http, publicActions, walletActions } from "viem";
import { foundry } from 'viem/chains'
import { counterAbi } from 'contracts'

const client = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http()
})
  .extend(publicActions)
  .extend(walletActions);

export const app = new Hono()

.use(cors())

.get("/", (c) => {
	return c.text("Hello Hono!");
})

.get("/hello", async (c) => {
	const data: ApiResponse = {
		message: "Hello BHVR!",
		success: true,
	};

	return c.json(data, { status: 200 });
});

.get('/contracts/:address/counter', async (c) => {
  try {
    const address = c.req.param('address') as \`0x\${ string }\`

    const result = await client.readContract({
      address,
      abi: counterAbi,
      functionName: 'number'
    })

    const response: ApiResponse = {
      message: \`Counter value: \${ result } \`,
      success: true
    }

    return c.json(response)
  } catch (error) {
    return c.json({
      message: 'Failed to read contract',
      success: false
    }, 500)
  }
})

export default app;`;

export const honoClientTemplate = `import { hc } from "hono/client";
import type { app } from "./index";

export type AppType = typeof app;
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);`;

export const defaultTemplate = `import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { hcWithType } from 'server/dist/client'
import { createTestClient, http, publicActions, walletActions } from "viem";
import { foundry } from 'viem/chains'
import { counterAbi } from 'contracts'
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D404fBaF464DfD85"

const client = hcWithType(SERVER_URL);
const viemClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http()
})
  .extend(publicActions)
  .extend(walletActions)

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

function App() {
  const [data, setData] = useState<Awaited<ReturnType<ResponseType["json"]>> | undefined>()
  const [counterValue, setCounterValue] = useState<bigint | undefined>()

  async function sendRequest() {
    try {
      const res = await client.hello.$get()
      if (!res.ok) {
        console.log("Error fetching data")
        return
      }
      const data = await res.json()
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function readContract() {
    try {
      const result = await viemClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "number"
      })
      setCounterValue(result)
    } catch (error) {
      console.log("Contract read error:", error)
    }
  }

  return (
    <>
      <div>
        <a href="https://github.com/stevedylandev/bhvr-forge" target="_blank">
          <img src={beaver} className="logo" alt="beaver logo" />
        </a>
      </div>
      <h1>bhvr forge</h1>
      <h2>Bun + Hono + Vite + React + Forge</h2>
      <p>A typesafe fullstack monorepo with smart contracts</p>
      <div className="card">
        <div className='button-container'>
          <button onClick={sendRequest}>
            Call API
          </button>
          <button onClick={readContract}>
            Read Contract
          </button>
          <a className='docs-link' target='_blank' href="https://forge.bhvr.dev">Docs</a>
        </div>
        {data && (
          <pre className='response'>
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
        {counterValue !== undefined && (
          <pre className='response'>
            <code>
            Counter Value: {counterValue.toString()}
            </code>
          </pre>
        )}
      </div>
    </>
  )
}

export default App`;

export const tailwindTemplate = `import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { hcWithType } from 'server/dist/client'
import { createTestClient, http, publicActions, walletActions } from "viem";
import { foundry } from 'viem/chains'
import { counterAbi } from 'contracts'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D404fBaF464DfD85"

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

const client = hcWithType(SERVER_URL);
const viemClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http()
})
  .extend(publicActions)
  .extend(walletActions);

function App() {
  const [data, setData] = useState<Awaited<ReturnType<ResponseType["json"]>> | undefined>()
  const [counterValue, setCounterValue] = useState<bigint | undefined>()

  async function sendRequest() {
    try {
      const res = await client.hello.$get()
      if (!res.ok) {
        console.log("Error fetching data")
        return
      }
      const data = await res.json()
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function readContract() {
    try {
      const result = await viemClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "number"
      })
      setCounterValue(result)
    } catch (error) {
      console.log("Contract read error:", error)
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a href="https://github.com/stevedylandev/bhvr-forge" target="_blank">
        <img
          src={beaver}
          className="w-16 h-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr forge</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React + Forge</h2>
      <p>A typesafe fullstack monorepo with smart contracts</p>
      <div className='flex items-center gap-4'>
        <button
          onClick={sendRequest}
          className="bg-black text-white px-2.5 py-1.5 rounded-md"
        >
          Call API
        </button>
        <button
          onClick={readContract}
          className="bg-black text-white px-2.5 py-1.5 rounded-md"
        >
          Read Contract
        </button>
        <a target='_blank' href="https://forge.bhvr.dev" className='border-1 border-black text-black px-2.5 py-1.5 rounded-md'>
          Docs
        </a>
      </div>
        {data && (
          <pre className="bg-gray-100 p-4 rounded-md">
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
        {counterValue !== undefined && (
          <pre className="bg-gray-100 p-4 rounded-md">
            <code>
            Counter Value: {counterValue.toString()}
            </code>
          </pre>
        )}
    </div>
  )
}

export default App`;

export const shadcnTemplate = `import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { Button } from './components/ui/button'
import { hcWithType } from 'server/dist/client'
import { createTestClient, http, publicActions, walletActions } from "viem";
import { forge } from 'viem/chains'
import { counterAbi } from 'contracts'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D404fBaF464DfD85"

const client = hcWithType(SERVER_URL);
const viemClient = createTestClient({
  chain: forge,
  mode: 'anvil',
  transport: http()
})
  .extend(publicActions)
  .extend(walletActions);

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

function App() {
  const [data, setData] = useState<Awaited<ReturnType<ResponseType["json"]>> | undefined>()
  const [counterValue, setCounterValue] = useState<bigint | undefined>()

  async function sendRequest() {
    try {
      const res = await client.hello.$get()
      if (!res.ok) {
        console.log("Error fetching data")
        return
      }
      const data = await res.json()
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function readContract() {
    try {
      const result = await viemClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: counterAbi,
        functionName: "number"
      })
      setCounterValue(result)
    } catch (error) {
      console.log("Contract read error:", error)
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <a href="https://github.com/stevedylandev/bhvr-forge" target="_blank">
        <img
          src={beaver}
          className="w-16 h-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr forge</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React + Forge</h2>
      <p>A typesafe fullstack monorepo with smart contracts</p>
      <div className='flex items-center gap-4'>
        <Button
          onClick={sendRequest}
        >
          Call API
        </Button>
        <Button
          onClick={readContract}
        >
          Read Contract
        </Button>
        <Button
          variant='secondary'
          asChild
        >
          <a target='_blank' href="https://forge.bhvr.dev">
          Docs
          </a>
        </Button>
      </div>
        {data && (
          <pre className="bg-gray-100 p-4 rounded-md">
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
        {counterValue !== undefined && (
          <pre className="bg-gray-100 p-4 rounded-md">
            <code>
            Counter Value: {counterValue.toString()}
            </code>
          </pre>
        )}
    </div>
  )
}

export default App`;
