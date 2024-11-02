package eu.zavadil.ocr.core.settings;

import java.util.HashMap;

public class CascadingSettings extends HashMap<String, String> {

	private final CascadingSettings parent;

	public CascadingSettings() {
		this.parent = null;
	}

	public CascadingSettings(CascadingSettings parent) {
		this.parent = parent;
	}

	public CascadingSettings addChild() {
		return new CascadingSettings(this);
	}

	public String get(String key) {
		if (this.containsKey(key)) {
			return super.get(key);
		}
		if (this.parent != null) {
			return this.parent.get(key);
		}
		return null;
	}

	@Override
	public String get(Object key) {
		return this.get(key.toString());
	}

	public void set(String key, String value) {
		if (value == null) {
			this.remove(key);
			return;
		}
		this.put(key, value);
	}

	public Boolean getBool(String key) {
		String val = this.get(key);
		if (val == null) return null;
		return val.equals("1");
	}

	public void setBool(String key, Boolean value) {
		this.set(key, value == null ? null : (value ? "1" : "0"));
	}

	public Integer getInt(String key) {
		String val = this.get(key);
		if (val == null) return null;
		return Integer.valueOf(val);
	}

	public void setInt(String key, Integer value) {
		this.set(key, value == null ? null : value.toString());
	}

}

