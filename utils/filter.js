const buildFilters = (query)=>{
    const filters = {};
    const stringFields = ['email','comany','city'];
    const enumFields = ['status','source'];
    const numberFields = ['score','lead_value'];
    const dateFields = ['created_at','last_activity_at'];
    const boolFields = ['is_qualified'];


    object.keys(query).forEach((key)=>{
        if(key==='page'|| key==='limit') return;

        let field = key;
        let operator = 'equals';
        ['_contains','_in','_gt','_It','_between','_on','_before','_after'].forEach(suffix=>{
            if(field.endsWith(suffix)){
                operator = suffix.slice(1);
                field = field.substring(0,field.length-suffix.length);
            }
        });


        const value = query[key];
        if(stringFields.include(field)){
            if(operator==='contains'){
                filter[field] ={$regex:value,$option:"i"};
            }
            else if(operator ==='equals'){
                filters[field] = value;
            }

        }
        else if(enumFields.include(field)){
            if(operator ==='in'){
                filters[field] = {$in:value.split(',')};

            }else{
                filters[field]  = value;
            }

        }else if(numberFields.include(field)){
            const num = Number;
            if(operator =='gt'){
                filters[field] = {$gt:Number(value)};
            }
            else if(operator==='lt'){
                filters[field] = {$lt:Number(value)};

            }
            else if(operator ==='between'){
                const [min,max] = value.split(',').map(Number);
                filters[field] = {$gte:min,$lte:max};
            }
            else{
                filters[field] = Number(value);
            }

        }
        else if(dateFields.include(field)){
            if(operator =='on'){
                const date = new Date(value);
                const nextDay = new Date(value);
                nextDay.setDate(date.getDate()+1);
                filters[field] = {$gte:date,$lt:nextDay};
            }
            else if(operator === 'before'){
                filters[field] = {$lt : new Date(value)};
            }else if(operator ==='after'){
                filters[field] ={$gt:new Date(value)};
            }else if (operator === 'between') {
        const [start, end] = value.split(',');
        filters[field] = { $gte: new Date(start), $lte: new Date(end) };
      }
        }
        else if(boolFields.include(field)){
           filters[field] = (value ===true || value ==='1');
        }
    });

    return filters;
}


module.exports = buildFilters;