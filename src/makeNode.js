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
        node.width = 180;
        node.outputs.push({ label: 'Output', value: 0, id: 0 })
    }
    if (type === 'math') {
        node.title = 'Math';
        node.height = 130;
        node.width = 210;
        node.outputs.push({ label: 'Output', value: 0, id: 0 })
        node.inputs.push({ label: 'Input A', value: 0, id: 0 })
        node.inputs.push({ label: 'Input B', value: 0, id: 1 })
    }
    if (type === 'display') {
        node.title = 'Display'
        node.width = 120
        node.height = 90
        node.inputs.push({ label: 'Input', value: 0, id: 0 })
    }
    
    if (type === 'rgb') {
        node.title = 'Combine RGB'
        node.width = 140
        node.inputs.push({ label: 'R', value: 0, id: 0 })
        node.inputs.push({ label: 'G', value: 0, id: 1 })
        node.inputs.push({ label: 'B', value: 0, id: 2 })
        
        node.outputs.push({ label: 'Color', value: 0, id: 0, type: 'color' })
    }

    if (type === 'pen') {
        node.title = 'Pen'
        node.inputs.push({ label: 'Radius', value: 0, id: 0 })
        node.inputs.push({ label: 'Colour', value: 0, id: 1 })
    }
    
    if (type === 'wave') {
        node.title = 'Wave'
        node.height = 260;
        node.inputs.push({ label: 'Amplitude', value: 0, id: '0' });
        node.inputs.push({ label: 'Frequency', value: 0, id: '1' });
        node.inputs.push({ label: 'Phase', value: 0, id: '2' });
    
        node.outputs.push({ label: 'Value', value: 0, id: '0' });
    }
    if (type === 'ramp') {
        node.title = 'Colour Ramp'
        node.height = 200;
        node.inputs.push({ label: 'Position', value: 0.2, id: '0' }); 
        node.outputs.push({ label: 'Color', value: [0,0,0], id: '0', type: 'color' });
    }

    return node;

}