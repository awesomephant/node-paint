export default function makeNode(type, x, y) {
    let node = {
        type: type,
        title: 'New Node',
        id: Math.random(),
        x: x,
        y: y,
        width: 250,
        height: 100,
        outputs: [],
        inputs: []
    }

    if (type === 'number') {
        node.title = 'Number'
        node.outputs.push({ label: 'Output', value: 0, id: 0 })
    }
    if (type === 'math') {
        node.title = 'Math';
        node.height = 130;
        node.outputs.push({ label: 'Output', value: 0, id: 0 })
        node.inputs.push({ label: 'Input A', value: 0, id: 0 })
        node.inputs.push({ label: 'Input B', value: 0, id: 1 })
    }
    if (type === 'display') {
        node.title = 'Display'
        node.width = 150
        node.inputs.push({ label: 'Input', value: 0, id: 0 })
    }
    
    if (type === 'rgb') {
        node.title = 'RGB'
        node.inputs.push({ label: 'R', value: 0, id: 0 })
        node.inputs.push({ label: 'G', value: 0, id: 1 })
        node.inputs.push({ label: 'B', value: 0, id: 2 })
    }

    if (type === 'pen') {
        node.title = 'Pen'
        node.inputs.push({ label: 'Radius', value: 0, id: 0 })
        node.inputs.push({ label: 'Colour', value: 0, id: 1 })
    }

    return node;

}