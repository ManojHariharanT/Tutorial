import registry from "../config/LanguageRegistry.js";
import { sfLangPlugin } from "./sflangPlugin.js";
import { javascriptPlugin } from "./javascriptPlugin.js";
import { pythonPlugin } from "./pythonPlugin.js";

// Initialize registry
registry.register(sfLangPlugin);
registry.register(javascriptPlugin);
registry.register(pythonPlugin);

export { registry };
