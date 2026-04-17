class LanguageRegistry {
  constructor() {
    this.plugins = new Map();
  }

  register(plugin) {
    if (!plugin.id) {
      throw new Error("LanguagePlugin must possess an 'id'");
    }
    this.plugins.set(plugin.id, plugin);
  }

  getPlugin(id) {
    return this.plugins.get(id) || null;
  }

  detect(filename) {
    if (!filename) return null;
    const ext = filename.split('.').pop().toLowerCase();
    for (const plugin of this.plugins.values()) {
      if (plugin.fileExtensions?.includes(ext)) {
        return plugin;
      }
    }
    return null;
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}

const registry = new LanguageRegistry();

export default registry;
