package eu.zavadil.ocr.core.settings;

public class ProcessingSettings extends CascadingSettings {

	public ProcessingSettings() {
		super();
	}

	public ProcessingSettings(ProcessingSettings parent) {
		super(parent);
	}

	@Override
	public ProcessingSettings addChild() {
		return new ProcessingSettings(this);
	}

	public Language getLanguage() {
		String val = this.get("language");
		if (val == null) return null;
		return Language.valueOf(val);
	}

	public void setLanguage(Language language) {
		this.set("language", language == null ? null : language.name());
	}

	public Integer getFragmentMinWidth() {
		return this.getInt("fragment.min.width");
	}

	public void setFragmentMinWidth(Integer minWidth) {
		this.setInt("fragment.min.width", minWidth);
	}

	public Integer getFragmentMinHeight() {
		return this.getInt("fragment.min.height");
	}

	public void setFragmentMinHeight(Integer minHeight) {
		this.setInt("fragment.min.height", minHeight);
	}

}
