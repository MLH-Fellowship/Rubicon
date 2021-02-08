var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* C:\Users\anast\Desktop\testing-9-12\Rubicon\Rubicon\webviews\components\Sidebar.svelte generated by Svelte v3.32.1 */

    const file = "C:\\Users\\anast\\Desktop\\testing-9-12\\Rubicon\\Rubicon\\webviews\\components\\Sidebar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[11] = list;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (48:2) {#each todos as todo (todo.text)}
    function create_each_block(key_1, ctx) {
    	let li;
    	let t0_value = /*todo*/ ctx[10].text + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*todo*/ ctx[10], /*each_value*/ ctx[11], /*todo_index*/ ctx[12]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "content  svelte-5627b2");
    			toggle_class(li, "complete", /*todo*/ ctx[10].completed);
    			add_location(li, file, 48, 4, 1253);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*todos*/ 1 && t0_value !== (t0_value = /*todo*/ ctx[10].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*todos*/ 1) {
    				toggle_class(li, "complete", /*todo*/ ctx[10].completed);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(48:2) {#each todos as todo (todo.text)}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if files && files[0]}
    function create_if_block(ctx) {
    	let p;
    	let t_value = /*files*/ ctx[2][0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-5627b2");
    			add_location(p, file, 64, 4, 1547);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 4 && t_value !== (t_value = /*files*/ ctx[2][0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(64:2) {#if files && files[0]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h1;
    	let t1;
    	let ul0;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let img;
    	let img_src_value;
    	let t6;
    	let form0;
    	let label;
    	let t8;
    	let input0;
    	let t9;
    	let textarea;
    	let t10;
    	let p;
    	let t12;
    	let form1;
    	let input1;
    	let t13;
    	let ul1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t14;
    	let div;
    	let input2;
    	let t15;
    	let t16;
    	let form2;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*todos*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*todo*/ ctx[10].text;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	let if_block = /*files*/ ctx[2] && /*files*/ ctx[2][0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Start Documentation";
    			t1 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "text, code snippet, and image support";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "export files or save for later";
    			t5 = space();
    			img = element("img");
    			t6 = space();
    			form0 = element("form");
    			label = element("label");
    			label.textContent = "Project Title";
    			t8 = space();
    			input0 = element("input");
    			t9 = space();
    			textarea = element("textarea");
    			t10 = space();
    			p = element("p");
    			p.textContent = "Write short notes:";
    			t12 = space();
    			form1 = element("form");
    			input1 = element("input");
    			t13 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			div = element("div");
    			input2 = element("input");
    			t15 = space();
    			if (if_block) if_block.c();
    			t16 = space();
    			form2 = element("form");
    			button = element("button");
    			button.textContent = "Export File";
    			attr_dev(h1, "class", "text-style svelte-5627b2");
    			add_location(h1, file, 18, 0, 516);
    			add_location(li0, file, 20, 2, 599);
    			add_location(li1, file, 21, 2, 649);
    			attr_dev(ul0, "class", "text-style margin svelte-5627b2");
    			add_location(ul0, file, 19, 0, 565);
    			if (img.src !== (img_src_value = "https://i.pinimg.com/originals/58/69/c3/5869c33465ee74da4d210a02fed95cd7.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Girl in a jacket");
    			attr_dev(img, "width", "500");
    			attr_dev(img, "height", "600");
    			add_location(img, file, 23, 0, 697);
    			attr_dev(label, "class", "text-style svelte-5627b2");
    			add_location(label, file, 30, 2, 876);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "svelte-5627b2");
    			add_location(input0, file, 31, 2, 928);
    			attr_dev(form0, "class", "content svelte-5627b2");
    			add_location(form0, file, 29, 0, 850);
    			attr_dev(textarea, "class", "svelte-5627b2");
    			add_location(textarea, file, 34, 0, 962);
    			attr_dev(p, "class", "text-style margin svelte-5627b2");
    			add_location(p, file, 36, 0, 989);
    			attr_dev(input1, "class", "svelte-5627b2");
    			add_location(input1, file, 43, 2, 1166);
    			add_location(form1, file, 37, 0, 1042);
    			add_location(ul1, file, 46, 0, 1206);
    			attr_dev(input2, "class", "margin svelte-5627b2");
    			attr_dev(input2, "type", "file");
    			add_location(input2, file, 61, 2, 1465);
    			add_location(div, file, 60, 0, 1456);
    			attr_dev(button, "class", "text-style margin svelte-5627b2");
    			add_location(button, file, 81, 2, 1897);
    			add_location(form2, file, 70, 0, 1604);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul0, anchor);
    			append_dev(ul0, li0);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, form0, anchor);
    			append_dev(form0, label);
    			append_dev(form0, t8);
    			append_dev(form0, input0);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[3]);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, form1, anchor);
    			append_dev(form1, input1);
    			set_input_value(input1, /*text*/ ctx[1]);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, ul1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}

    			insert_dev(target, t14, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, input2);
    			append_dev(div, t15);
    			if (if_block) if_block.m(div, null);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, form2, anchor);
    			append_dev(form2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(form1, "submit", prevent_default(/*submit_handler*/ ctx[6]), false, true, false),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[8]),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(form2, "submit", prevent_default(handleSubmit), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 8) {
    				set_input_value(textarea, /*value*/ ctx[3]);
    			}

    			if (dirty & /*text*/ 2 && input1.value !== /*text*/ ctx[1]) {
    				set_input_value(input1, /*text*/ ctx[1]);
    			}

    			if (dirty & /*todos*/ 1) {
    				each_value = /*todos*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul1, destroy_block, create_each_block, null, get_each_context);
    			}

    			if (/*files*/ ctx[2] && /*files*/ ctx[2][0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(form0);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(form1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(form2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", slots, []);
    	let todos = [];
    	let text = "";
    	let files = [];
    	let value = `Add description. Some words are *italic*, some are **bold**`;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(3, value);
    	}

    	function input1_input_handler() {
    		text = this.value;
    		$$invalidate(1, text);
    	}

    	const submit_handler = () => {
    		$$invalidate(0, todos = [{ text, completed: false }, ...todos]);
    		$$invalidate(1, text = "");
    	};

    	const click_handler = (todo, each_value, todo_index) => {
    		$$invalidate(0, each_value[todo_index].completed = !todo.completed, todos);
    	};

    	function input2_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	const click_handler_1 = () => {
    		tsvscode.postMessage({ type: "onInfo", value: "info message " });
    	};

    	$$self.$capture_state = () => ({ todos, text, files, value });

    	$$self.$inject_state = $$props => {
    		if ("todos" in $$props) $$invalidate(0, todos = $$props.todos);
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("files" in $$props) $$invalidate(2, files = $$props.files);
    		if ("value" in $$props) $$invalidate(3, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		todos,
    		text,
    		files,
    		value,
    		textarea_input_handler,
    		input1_input_handler,
    		submit_handler,
    		click_handler,
    		input2_change_handler,
    		click_handler_1
    	];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new Sidebar({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=sidebar.js.map
