import { useState } from 'react';
import Button from './Components/Button';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

function App() {
    const [userAddress, setUserAddress] = useState<any>('');
    const [results, setResults] = useState<any>([]);
    const [hasQueried, setHasQueried] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tokenDataObjects, setTokenDataObjects] = useState<any>([]);
    const [connectedAddress, setConnectedAddress] = useState<
        string | undefined
    >();

    // console.log(userAddress);

    const account = useAccount({
        onConnect({ address }) {
            setConnectedAddress(address);
        },
    });

    async function getTokenBalance(address: string) {
        setIsLoading(true);
        const config = {
            apiKey: ALCHEMY_API_KEY,
            network: Network.ETH_MAINNET,
        };

        const alchemy = new Alchemy(config);
        console.log(address);
        const data = await alchemy.core.getTokenBalances(address);

        setResults(data);

        const tokenDataPromises = [];

        for (let i = 0; i < data.tokenBalances.length; i++) {
            const tokenData = alchemy.core.getTokenMetadata(
                data.tokenBalances[i].contractAddress
            );
            tokenDataPromises.push(tokenData);
        }

        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
        setIsLoading(false);
        setUserAddress('');
    }

    function getMyTokenBalance() {
        if (connectedAddress) {
            getTokenBalance(connectedAddress.toString());
        }
    }

    function queryTokenBalance() {
        if (userAddress) {
            getTokenBalance(userAddress.toString());
        }
    }

    return (
        <div className='bg-zinc-900 relative flex flex-col items-center justify-center w-screen h-screen p-10 text-white'>
            <div className='absolute top-0 right-0 m-4'>
                <ConnectButton showBalance={false} />
            </div>
            {connectedAddress ? (
                <div className='absolute top-0 left-0 m-4'>
                    {isLoading ? (
                        <Button
                            onClick={queryTokenBalance}
                            text='Loading...'
                            disabled={isLoading}
                        />
                    ) : (
                        <Button
                            onClick={getMyTokenBalance}
                            text='Check My ERC-20 Token Balances'
                            disabled={isLoading}
                        />
                    )}
                </div>
            ) : null}
            <div className='flex flex-col items-center justify-center'>
                <h1 className='md:text-5xl lg:text-6xl mb-4 text-4xl font-extrabold leading-none tracking-tight text-white'>
                    ERC-20 Token Indexer
                </h1>
                <h2 className='sm:px-16 lg:text-xl xl:px-48 mb-6 text-lg font-normal text-gray-400'>
                    Plug in an address and this website will return all of its
                    ERC-20 token balances!
                </h2>
            </div>
            <div className='flex flex-col items-center justify-center w-1/3 mt-8'>
                <div className='w-full mb-6'>
                    <label
                        htmlFor='wallet-address'
                        className='block mb-2 text-sm font-medium text-white'
                    >
                        Wallet Address
                    </label>
                    <input
                        onChange={(e) => setUserAddress(e.target.value)}
                        type='text'
                        id='wallet-address'
                        value={userAddress}
                        className='w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    />
                </div>
                {isLoading ? (
                    <Button
                        onClick={queryTokenBalance}
                        text='Loading...'
                        disabled={isLoading}
                    />
                ) : (
                    <Button
                        onClick={queryTokenBalance}
                        text='Check ERC-20 Token Balances'
                        disabled={isLoading}
                    />
                )}
                <h2 className='mb-6 text-lg font-normal text-gray-400'>
                    ERC-20 token balances:
                </h2>
            </div>
            {hasQueried ? (
                <div className='max-h-32 w-fit flex flex-col items-center justify-center mt-8 overflow-auto'>
                    {results.tokenBalances.map((e: any, i: number) => {
                        const balance = Utils.formatUnits(
                            e.tokenBalance,
                            tokenDataObjects[i].decimals
                        );

                        const decimalsLength = balance
                            .toString()
                            .split('.')[1].length;

                        if (balance === '0.0') {
                            return;
                        }

                        return (
                            <div
                                key={i}
                                className='flex items-start justify-start w-full gap-4'
                            >
                                <p>
                                    <b>Symbol:</b> ${tokenDataObjects[i].symbol}
                                </p>
                                <p>
                                    <b>Balance: </b>
                                    {decimalsLength <= 3
                                        ? balance
                                        : parseFloat(balance).toFixed(3)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

export default App;
