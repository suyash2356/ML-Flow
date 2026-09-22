import { useState } from 'react';
import './ArchitectureDesignLab.css';

interface LayerBlock {
  id: string;
  name: string;
  type: 'Input' | 'Conv2D' | 'Pooling' | 'Dense' | 'Dropout' | 'Activation';
  tensorShape: string;
  params: string;
  description: string;
}

const DEFAULT_LAYERS: LayerBlock[] = [
  {
    id: 'l1',
    name: 'Input Layer',
    type: 'Input',
    tensorShape: '(Batch, 28, 28, 1)',
    params: '784 inputs (Grayscale)',
    description: 'Entry layer representing input image matrix pixels normalized into [0, 1].',
  },
  {
    id: 'l2',
    name: 'Conv2D (32 Filters, 3x3)',
    type: 'Conv2D',
    tensorShape: '(Batch, 26, 26, 32)',
    params: '320 trainable weights',
    description: 'Extracts spatial 2D localized edge and texture feature maps.',
  },
  {
    id: 'l3',
    name: 'MaxPooling2D (2x2)',
    type: 'Pooling',
    tensorShape: '(Batch, 13, 13, 32)',
    params: '0 params (Fixed Downsampling)',
    description: 'Downsamples spatial dimensions by taking maximum values across 2x2 windows.',
  },
  {
    id: 'l4',
    name: 'Dropout (0.25)',
    type: 'Dropout',
    tensorShape: '(Batch, 13, 13, 32)',
    params: 'Rate: 25% zeroed',
    description: 'Randomly zeros 25% of feature map channels during training to prevent co-adaptation.',
  },
  {
    id: 'l5',
    name: 'Dense Fully Connected (128)',
    type: 'Dense',
    tensorShape: '(Batch, 128)',
    params: '692,352 weights',
    description: 'Flattened classification bottleneck combining all spatial features.',
  },
  {
    id: 'l6',
    name: 'Softmax Output (10 Classes)',
    type: 'Activation',
    tensorShape: '(Batch, 10)',
    params: '1,290 weights',
    description: 'Outputs calibrated probability distribution across 10 classification categories.',
  },
];

export function ArchitectureDesignLab() {
  const [layers, setLayers] = useState<LayerBlock[]>(DEFAULT_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string>(DEFAULT_LAYERS[1].id);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || layers[0];

  const addLayer = (type: LayerBlock['type']) => {
    const newL: LayerBlock = {
      id: `layer-${Date.now()}`,
      name: `${type} Block`,
      type,
      tensorShape: '(Batch, 64)',
      params: '2,048 params',
      description: `Newly added ${type} layer block to deep architecture.`,
    };
    setLayers([...layers, newL]);
    setSelectedLayerId(newL.id);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 2) return;
    setLayers(layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(layers[0].id);
  };

  return (
    <section className="architecture-lab">
      <div className="architecture-lab__header">
        <div>
          <h3 className="architecture-lab__title">🔬 Architecture & Layer Design Lab</h3>
          <span className="architecture-lab__subtitle">
            Visual Tensor Shape Propagation & Deep Learning Builder
          </span>
        </div>

        <div className="architecture-lab__palette">
          <span className="architecture-lab__palette-label">+ Add Layer:</span>
          {(['Conv2D', 'Dense', 'Dropout', 'Activation'] as LayerBlock['type'][]).map((t) => (
            <button
              key={t}
              type="button"
              className="architecture-lab__add-btn"
              onClick={() => addLayer(t)}
            >
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="architecture-lab__grid">
        {/* Canvas Area with Connected Blocks */}
        <div className="architecture-lab__canvas">
          <div className="architecture-lab__blocks-flow">
            {layers.map((layer, idx) => (
              <div key={layer.id} className="architecture-lab__block-container">
                <div
                  className={`architecture-lab__block architecture-lab__block--${layer.type.toLowerCase()} ${
                    selectedLayerId === layer.id ? 'architecture-lab__block--selected' : ''
                  }`}
                  onClick={() => setSelectedLayerId(layer.id)}
                >
                  <div className="architecture-lab__block-top">
                    <span className="architecture-lab__block-type">{layer.type}</span>
                    <button
                      type="button"
                      className="architecture-lab__block-del"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      title="Remove Layer"
                    >
                      ×
                    </button>
                  </div>
                  <strong className="architecture-lab__block-name">{layer.name}</strong>
                  <span className="architecture-lab__block-shape">{layer.tensorShape}</span>
                </div>

                {idx < layers.length - 1 && (
                  <div className="architecture-lab__flow-connector">
                    <span>▼</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel: Tensor Shape & Layer Inspector */}
        <aside className="architecture-lab__inspector">
          <div className="architecture-lab__inspector-header">
            <span className="architecture-lab__inspector-badge">Selected Layer Inspector</span>
            <h4>{selectedLayer.name}</h4>
          </div>

          <div className="architecture-lab__inspector-field">
            <label>Output Tensor Shape:</label>
            <code className="architecture-lab__tensor-code">{selectedLayer.tensorShape}</code>
          </div>

          <div className="architecture-lab__inspector-field">
            <label>Trainable Parameters:</label>
            <span className="architecture-lab__inspector-val">{selectedLayer.params}</span>
          </div>

          <div className="architecture-lab__inspector-field">
            <label>Architectural Role & Description:</label>
            <p className="architecture-lab__inspector-desc">{selectedLayer.description}</p>
          </div>

          <div className="architecture-lab__inspector-footer">
            <span className="architecture-lab__inspector-hint">
              Shape propagation calculated automatically across sequential layers.
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
