import React from 'react';

type Props = {
    text: string;
    onClick: () => void;
};

export default function Button({ text, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            type='button'
            className='hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 px-5 py-2 mb-2 mr-2 text-base font-medium text-white bg-blue-700 rounded-lg'
        >
            {text}
        </button>
    );
}
