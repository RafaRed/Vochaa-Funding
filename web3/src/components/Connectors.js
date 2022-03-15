import {InjectedConnector} from '@web3-react/injected-connector'

// Instanciate your other connectors.
export const injected = new InjectedConnector({supportedChainIds: [1,137,56]})



var connector = {
    injected: injected,

};


export default connector