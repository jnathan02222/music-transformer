import torch
from datasets import IterableDataset
from transformers import (
    GPT2Config,
    GPT2LMHeadModel,
    Trainer,
    TrainingArguments,
)
from array import array

#main things to tune
    #dataset: don't collate, get more data
    #hyperparameters: epochs

"""
DATASET
"""
MAX_CONTEXT_LENGTH = 1024
PADDING_TOKEN = 50256

def load_int_array_from_bin_file(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    int_array = array('i')
    int_array.frombytes(data)
    return int_array.tolist()

def gen():
    input_ids = []
    for i in range(1000000):
        next_ids = (load_int_array_from_bin_file(f'data/playlists_artists_reduced/{i}.bin') + [PADDING_TOKEN])[:MAX_CONTEXT_LENGTH]

        if(len(input_ids) + len(next_ids) <= MAX_CONTEXT_LENGTH):
            input_ids += next_ids 
        else:
            input_ids += [PADDING_TOKEN] * (MAX_CONTEXT_LENGTH - len(input_ids))
            yield {
                "input_ids": input_ids,  
                "attention_mask": [(0 if token_id == PADDING_TOKEN else 1) for token_id in input_ids],
                "labels": input_ids
            }
            input_ids = next_ids

    #Skips last example whoops
    

dataset = IterableDataset.from_generator(gen)

"""
MODEL
"""
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
model = GPT2LMHeadModel(GPT2Config()).to(device)

"""
TRAINING ARGS
"""
BATCH_SIZE = 512
EPOCHS = 1
NUM_TRAINING_EXAMPLES = EPOCHS*60000000//1024 #60 million tokens and 1024 max context length

training_args = TrainingArguments(
    output_dir="./ml/gpt2-artists",
    overwrite_output_dir=True,

    num_train_epochs=EPOCHS,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=BATCH_SIZE//4,
    warmup_ratio = 0.1,
    max_steps=NUM_TRAINING_EXAMPLES//BATCH_SIZE,

    save_strategy="steps",          
    save_steps=10, 
)


"""
EXECUTION
"""
trainer = Trainer(
    model=model,
    train_dataset=dataset,
    args=training_args
)
trainer.train()
trainer.save_model()