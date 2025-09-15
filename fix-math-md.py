import re

# Carregar o conteúdo do arquivo original
with open("post.markdown", "r") as f:
    content = f.read()

# Converter expressões inline \( ... \) para $$ ... $$
# Substitui \( ... \) por $$ ... $$ e \[ ... \] por $$ ... $$
content_fixed = re.sub(r'\\\((.+?)\\\)', r'$$\1$$', content, flags=re.DOTALL)
content_fixed = re.sub(r'\\\[(.+?)\\\]', r'$$\1$$', content_fixed, flags=re.DOTALL)

# Salvar a versão corrigida
output_path = "post-fixed.markdown"
with open(output_path, "w") as f:
    f.write(content_fixed)

output_path
