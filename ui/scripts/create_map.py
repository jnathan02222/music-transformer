from transformers import AutoModelForCausalLM 
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import mplcursors

model = AutoModelForCausalLM.from_pretrained("./ml/gpt2-artists")

embeddings = model.get_input_embeddings().weight.detach().cpu().numpy()

pca = PCA(n_components=50)
tsne = TSNE(n_components=2)
embeddings_2d = tsne.fit_transform(pca.fit_transform(embeddings))

# Plot interactively
fig, ax = plt.subplots(figsize=(12, 8))
scatter = ax.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], s=5, alpha=0.6)
ax.set_title(f"t-SNE of GPT-2 Embeddings")
ax.set_xlabel('Dimension 1')
ax.set_ylabel('Dimension 2')
plt.tight_layout()

# Enable hover annotations showing token IDs
cursor = mplcursors.cursor(scatter, hover=True)
@cursor.connect("add")
def on_add(sel):
    idx = sel.index
    sel.annotation.set_text(f"Token ID: {idx}")

plt.show()