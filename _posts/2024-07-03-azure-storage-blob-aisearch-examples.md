---
layout: post
title:  "Azure AI Loader"
date:   2024-07-03 20:01:28
categories: programming
tags: featured
image: /assets/article_images/fotis-fotopoulos-6sAl6aQ4OWI-unsplash.jpg
---

Implementing Azure Blob Storage with focus on adding methods to upload data to an Azure Blob Storage container.

Examples

### Azure Blob Storage Loader

```python
import logging
from typing import Dict, List, Optional
import pandas as pd
import weaviate
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from rich.progress import track
from ml5_aws_tools.ssm import SSMParameterStore
from src.helpers.guid import generate_v4_quid

logger = logging.getLogger(__name__)

class Weaviate:
    """This class contains methods to connect, read infer schema, create 
    index and load data to Weaviate and Azure Blob Storage"""

    def __init__(
            self,
            parquet,
            index_name: str,
            client: weaviate.Client,
    ) -> None:
        # Parameters
        self.parquet = parquet
        self.index_name = index_name
        self.client = client
        # Data
        self.df = None
        self.schema = None 
        # Check status 
        logger.info(f"Weaviate status-up: {self.client.is_live()}")

    @classmethod
    def conn(
        cls,
        weaviate_url: str = None,
        additional_headers: Dict = {},
    ) -> weaviate.Client:
        """This method sets up a connection to the Weaviate client.
        Parameters:
        additional_headers (Dict): The additional headers for the 
        weaviate client.
        """
        if weaviate_url is None:
            parameter_store = SSMParameterStore()
            weaviate_url = parameter_store.get('/eks/weaviate_url')
        if weaviate_url is None:
            raise RuntimeError("Weaviate URL not found")
        return weaviate.Client(
            url=weaviate_url,
            additional_headers=additional_headers,
        )

    def upload_to_azure_blob(self, container_name: str, blob_name: str, connection_string: str) -> None:
        """Uploads the parquet file to Azure Blob Storage.
        
        Parameters:
        container_name (str): The name of the Azure Blob Storage container.
        blob_name (str): The name of the blob.
        connection_string (str): The connection string for Azure Blob Storage.
        """
        try:
            blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
            
            with open(self.parquet, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
            
            logger.info(f"File {self.parquet} uploaded to {container_name}/{blob_name} in Azure Blob Storage.")
        except Exception as e:
            logger.error(f"Error uploading to Azure Blob Storage: {e}")
            raise

    # Add other methods and functionalities as needed...
```

In this implementation:

Import Required Azure Modules: Added imports for BlobServiceClient, BlobClient, and ContainerClient.
Upload Method: Added upload_to_azure_blob method in the Weaviate class to handle the upload process to Azure Blob Storage.
Example Usage
Here's how you can use the upload_to_azure_blob method:

```python
# Assuming you have already created a Weaviate object
weaviate_instance = Weaviate(parquet='path/to/your/file.parquet', index_name='your_index', client=weaviate_client)

# Azure Blob Storage details
container_name = 'your-container-name'
blob_name = 'your-blob-name'
connection_string = 'your-azure-storage-connection-string'

# Upload parquet file to Azure Blob Storage
weaviate_instance.upload_to_azure_blob(container_name, blob_name, connection_string)
```

This will upload your parquet file to the specified Azure Blob Storage container and handle any errors that might occur during the upload process. ​​

