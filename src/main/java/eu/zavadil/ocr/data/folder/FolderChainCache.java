package eu.zavadil.ocr.data.folder;

import eu.zavadil.java.spring.common.entity.cache.RepositoryHashCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FolderChainCache extends RepositoryHashCache<FolderChain> {

	@Autowired
	public FolderChainCache(FolderChainRepository repository) {
		super(repository);
	}

}
