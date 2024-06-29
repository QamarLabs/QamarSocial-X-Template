"use client";
import { Provider } from 'react-redux';
import createStore from '@localredux/store';

export default function ReduxProviderWrapper({children}: React.PropsWithChildren<any>) {
    return (
        <Provider store={createStore()}>
            {children}
        </Provider>
    );
}