export default {
    contextMenu: {
        isOpen: false,
        x: 0,
        y: 0
    },
    nodes: [
        {
            type: 'number',
            title: 'Number',
            id: 0,
            x: 100,
            y: 250,
            width: 250,
            height: 100,
            outputs: [
                { label: 'Output', value: 13, id: '0' }
            ]
        },
        {
            type: 'number',
            title: 'Number',
            id: -1,
            x: 100,
            y: 450,
            width: 250,
            height: 100,
            outputs: [
                { label: 'Output', value: 13, id: '0' }
            ]
        },
        {
            type: 'math',
            title: 'Multiply',
            id: 1,
            x: 500,
            y: 350,
            width: 250,
            height: 110,
            inputs: [
                { label: 'Value A', value: 0, id: 0 },
                { label: 'Value B', value: 0, id: 1 }
            ],
            outputs: [
                { label: 'Output', value: 0, id: '0' }
            ]
        },
        {
            type: 'display',
            id: 2,
            x: 560,
            y: 500,
            width: 160,
            height: 100,
            inputs: [
                { label: 'Input', value: 0, id: 0 }
            ]
        }
    ],
    connections: [
        { from: { nodeID: 0, socket: 0 }, to: { nodeID: 1, socket: 0 }, id: 0 },
        { from: { nodeID: -1, socket: 0 }, to: { nodeID: 1, socket: 1 }, id: 1 },
        { from: { nodeID: 1, socket: 0 }, to: { nodeID: 2, socket: 0 }, id: 2 },
    ]
}