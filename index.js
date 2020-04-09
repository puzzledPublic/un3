const _ = {};

const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

const getLength = list => (list == null ? void 0 : list.length);

const isArrayLike = list => {
  const length = getLength(list);
  return typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX;
};

const bloop = (new_data, body, stopper, is_reduce) => {
    return (data, iter_predi = _.identity, opt1) => {
        let result = new_data(data);
        let memo = is_reduce ? opt1 : undefined;
        let limiter = is_reduce ? undefined : opt1;
        let keys = isArrayLike(data) ? null : _.keys(data);

        if(is_reduce) { //_.reduce
            for(let i = 0, len = (keys || data).length; i < len; i++) {
                const key = keys ? keys[i] : i;
                memo = iter_predi(memo, data[key], key, data);
            }
            return memo;
        }
        if(stopper) {   //_.find, _.some, _.every, _.findIndex, _.findKey
            for(let i = 0, len = (keys || data).length; i < len; i++) {
                const key = keys ? keys[i] : i;
                const memo = iter_predi(data[key], key, data);
                if(stopper(memo)) return body(memo, result, data[key], key);
            }
        } else if(limiter) {    //_.each, _.map, _.filter, _.reject
            for(let i = 0, len = (keys || data).length; i < len; i++) {
                const key = keys ? keys[i] : i;
                body(iter_predi(data[key], key, data), result, data[key]);
                if(limiter == result.length) break;
            }
        } else {    //_.each, _.map, _.filter, _.reject
            for(let i = 0, len = (keys || data).length; i < len; i++) {
                const key = keys ? keys[i] : i;
                body(iter_predi(data[key], key, data), result, data[key]);
            }
        }
        return result;
        // for(let i = 0, len = (keys || data).length; i < len; i++) {
        //     const key = keys ? keys[i] : i;
        //     memo = is_reduce ? iter_predi(memo, data[key], key, data) : iter_predi(data[key], key, data);
        //     if(!stopper) body(memo, result, data[key], key);
        //     else if(stopper(memo)) return body(memo, result, data[key], key);
        //     if(limiter && limiter == result.length) break;
        // }
        
        // return is_reduce ? memo : result;
    }
}

_.identity = v => v;

_.array = () => [];

_.push_to = (val, obj) => obj.push(val);

_.push = (obj, val) => obj.push(val);

_.map = bloop(_.array, _.push_to);

_.values = list => _.map(list, _.identity);

_.args0 = _.identity;

_.args1 = (a, b) => b;

_.isObject = obj => {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}
_.keys = obj => _.isObject(obj) ? Object.keys(obj) : [];

_.noop = () => {};

_.each = bloop(_.identity, _.noop);

_.toArray = list => Array.isArray(list) ? list : _.values(list);

_.rest = (list, num) => _.toArray(list).slice(num || 1);

_.reverse = list => _.toArray(list).reverse();

_.rester = (func, num) => (...args) => func.apply(null, _.rest(args, num));

_.if = (validator, func, alter) => (...args) => validator.apply(null, args) ? func.apply(null, args) : alter && alter.apply(null, args);

_.filter = bloop(_.array, _.if(_.identity, _.rester(_.push)));

_.negate = func => v => !func(v);

_.not = v => !v;

_.reject = bloop(_.array, _.if(_.not, _.rester(_.push)));
//_.reject = bloop(_.array, _.if(_.identity, _.noop, _.rester(_.push)));
//_.reject = bloop(_.array, _.if(_.negate(_.identity), _.rester(_.push)));

_.safety = _.with_validator = _.if;

_.toArray2 = _.if(Array.isArray, _.identity, _.values);

_.constant = v => () => v;

_.isNumber = a => (toString.call(a) == '[object Number]');

_.find = bloop(_.noop, _.rester(_.identity, 2), _.identity);

_.findIndex = bloop(_.constant(-1), _.rester(_.identity, 3), _.identity);

_.findKey = bloop(_.noop, _.rester(_.identity, 3), _.identity);

_.some = bloop(_.constant(false), _.constant(true), _.identity);

_.every = bloop(_.constant(true), _.constant(false), _.not);

// _.reduce = (data, iteratee, memo) => {
//     _.each(data, (val, idx, data) => {
//         memo = iteratee(memo, val, idx, data);
//     });
//     return memo;
// };

_.reduce = bloop(_.noop, _.noop, undefined, true);

_.once = func => {
    let flag, result;
    return (...rest) => {
        if(flag) return result;
        flag = true;
        return result = func.apply(null, rest); 
    }
}

_.skip = body => {
    let yes;
    return (...rest) => (yes || (yes = body.apply(null, rest)));
}

_.partial = (func, ...outerRest) => {
    return (...innerRest) => {
        let copyRest = [...outerRest];
        let args = [];
        let k = 0;
        for(let i = 0; i < copyRest.length; i++) {
            args.push((copyRest[i] == _ ? innerRest[k++] : copyRest[i]));
        }
        args = args.concat(...innerRest.slice(k));

        return func.apply(null, args);
    }
}
module.exports = _;
