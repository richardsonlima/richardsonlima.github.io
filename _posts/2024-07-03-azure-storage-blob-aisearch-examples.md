---
layout: post
title:  "Azure AI Loader"
date:   2024-07-03 20:01:28
categories: programming
tags: featured
image: /assets/article_images/fotis-fotopoulos-6sAl6aQ4OWI-unsplash.jpg
---

 Examples

### Azure Blob Storage Loader

```python
"""Azure Blob Storage loader"""

import logging
from typing import Dict
import pandas as pd
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__

logger = logging.getLogger(__name__)

class AzureBlobStorage:
    """This class contains methods to connect, read, and load data to Azure Blob Storage"""

    def __init__(self, parquet, container_name: str, connection_string: str) -> None:
        # Parameters
        self.parquet = parquet
        self.container_name = container_name
        self.connection_string = connection_string
        # Data
        self.df = None
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        self.container_client = self.blob_service_client.get_container_client(self.container_name)

    @classmethod
    def conn(cls, connection_string: str) -> BlobServiceClient:
        """Establish connection to Azure Blob Storage"""
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        logger.info(f"Azure Blob Storage connected: {blob_service_client.account_name}")
        return blob_service_client

    def read_data(self) -> None:
        """Read data from the parquet file"""
        self.df = pd.read_parquet(self.parquet)
        logger.info("Data loaded into dataframe")

    def load_data(self) -> None:
        """Load dataframe to Azure Blob Storage"""
        if self.df is None:
            self.read_data()
        
        # Convert dataframe to CSV format
        csv_data = self.df.to_csv(index=False)
        blob_client = self.container_client.get_blob_client(f"{self.container_name}.csv")

        # Upload the CSV data
        blob_client.upload_blob(csv_data, blob_type="BlockBlob", overwrite=True)
        logger.info(f"Data uploaded to Azure Blob Storage container: {self.container_name}")

# Usage Example:
# connection_string = "your_connection_string"
# parquet_file_path = "path_to_your_parquet_file"
# container_name = "your_container_name"

# azure_blob_storage = AzureBlobStorage(parquet_file_path, container_name, connection_string)
# azure_blob_storage.read_data()
# azure_blob_storage.load_data()
```

## Explanation:

AzureBlobStorage Class:

__init__: Initializes the class with the parquet file path, container name, and connection string.
conn: Establishes the connection to Azure Blob Storage using the connection string.
read_data: Reads data from the parquet file and loads it into a dataframe.
load_data: Converts the dataframe to CSV format and uploads it to the specified Azure Blob Storage container.
Usage Example: Provides an example of how to use the AzureBlobStorage class to load data from a parquet file to Azure Blob Storage.


## Azure AI Search Loader
This includes setting up an Azure Blob Storage container, creating Azure AI Search indexes, and referring to the Azure Blob container in the index.

Here is a draft implementation for Azure AI Search based on the provided pattern:

```python
import logging
from typing import Dict, List, Optional

import numpy as np
import pandas as pd
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SimpleField,
    SearchableField,
    ComplexField,
    SearchIndexer,
    SearchIndexerDataSourceConnection,
    SearchIndexerSkillset,
    CorsOptions,
    ScoringProfile,
    SearchIndexerDataSourceType,
)
from azure.core.credentials import AzureKeyCredential
from rich.progress import track

logger = logging.getLogger(__name__)

class AzureAISearch:
    """This class contains methods to connect, read infer schema, create 
    index and load data to Azure AI Search"""

    def __init__(
            self,
            parquet,
            index_name: str,
            search_service_endpoint: str,
            admin_key: str,
            blob_service_client: BlobServiceClient,
    ) -> None:
        # Parameters
        self.parquet = parquet
        self.index_name = index_name
        self.search_service_endpoint = search_service_endpoint
        self.admin_key = admin_key
        self.blob_service_client = blob_service_client
        # Data
        self.df = None
        self.schema = None
        # Azure Clients
        self.index_client = SearchIndexClient(endpoint=self.search_service_endpoint, credential=AzureKeyCredential(self.admin_key))
        self.search_client = None
        self.container_client = None

    @classmethod
    def conn(
        cls,
        search_service_endpoint: str,
        admin_key: str,
        blob_connection_string: str,
    ) -> 'AzureAISearch':
        """This method sets up a connection to the Azure AI Search and Blob Service clients."""
        blob_service_client = BlobServiceClient.from_connection_string(blob_connection_string)
        return cls(
            parquet=None,
            index_name=None,
            search_service_endpoint=search_service_endpoint,
            admin_key=admin_key,
            blob_service_client=blob_service_client,
        )

    def create_blob_container(self, container_name: str) -> None:
        """Create a new container in the Azure Blob Storage."""
        self.container_client = self.blob_service_client.create_container(container_name)
        logger.info(f"Created blob container: {container_name}")

    def upload_to_blob(self, file_path: str, blob_name: str) -> None:
        """Upload a file to the Azure Blob Storage container."""
        blob_client = self.blob_service_client.get_blob_client(container=self.container_client.container_name, blob=blob_name)
        with open(file_path, "rb") as data:
            blob_client.upload_blob(data)
        logger.info(f"Uploaded {file_path} to blob storage as {blob_name}")

    def infer_schema(self) -> None:
        """Infer schema from the Parquet file."""
        self.df = pd.read_parquet(self.parquet)
        self.schema = [
            SearchableField(name=col, type="Edm.String") if self.df[col].dtype == 'object' else
            SimpleField(name=col, type="Edm.Double") for col in self.df.columns
        ]
        logger.info(f"Inferred schema: {self.schema}")

    def create_index(self) -> None:
        """Create an Azure AI Search index."""
        fields = self.schema
        cors_options = CorsOptions(allowed_origins=["*"], max_age_in_seconds=60)
        scoring_profiles = []
        suggesters = []
        index = SearchIndex(
            name=self.index_name,
            fields=fields,
            cors_options=cors_options,
            scoring_profiles=scoring_profiles,
            suggesters=suggesters,
        )
        self.index_client.create_index(index)
        self.search_client = SearchClient(endpoint=self.search_service_endpoint, index_name=self.index_name, credential=AzureKeyCredential(self.admin_key))
        logger.info(f"Created Azure AI Search index: {self.index_name}")

    def create_indexer(self, indexer_name: str, container_name: str, data_source_name: str) -> None:
        """Create an Azure AI Search indexer."""
        data_source_connection = SearchIndexerDataSourceConnection(
            name=data_source_name,
            type=SearchIndexerDataSourceType.AZURE_BLOB,
            connection_string=self.blob_service_client.url,
            container=container_name,
        )
        indexer = SearchIndexer(
            name=indexer_name,
            data_source_name=data_source_name,
            target_index_name=self.index_name,
        )
        self.index_client.create_data_source_connection(data_source_connection)
        self.index_client.create_indexer(indexer)
        logger.info(f"Created Azure AI Search indexer: {indexer_name}")

    def load_data(self) -> None:
        """Load data into the Azure AI Search index."""
        actions = [
            {
                "actionType": "upload",
                "searchAction": {
                    "value": row.to_dict()
                }
            }
            for _, row in self.df.iterrows()
        ]
        self.search_client.upload_documents(actions)
        logger.info("Loaded data into Azure AI Search index")

# Example usage:
# az_search = AzureAISearch.conn(search_service_endpoint='your-search-service-endpoint', admin_key='your-admin-key', blob_connection_string='your-blob-connection-string')
# az_search.create_blob_container('your-container-name')
# az_search.upload_to_blob('your-file-path', 'your-blob-name')
# az_search.infer_schema()
# az_search.create_index()
# az_search.create_indexer('your-indexer-name', 'your-container-name', 'your-data-source-name')
# az_search.load_data()
```
