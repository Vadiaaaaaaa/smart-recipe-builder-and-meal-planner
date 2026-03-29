import { useState, useReducer, useContext, createContext, useMemo, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const INGREDIENT_SUGGESTIONS = [
  "tomato","onion","garlic","ginger","chicken","beef","fish","tofu","paneer",
  "spinach","mushroom","bell pepper","carrot","potato","cauliflower","broccoli",
  "pasta","rice","quinoa","lentils","chickpeas","olive oil","butter","cream",
  "milk","cheese","egg","lemon","coriander","cumin","turmeric","paprika","chili",
  "black pepper","basil","oregano","avocado","cucumber","zucchini","corn","peas",
  "celery","kale","lettuce","arugula","noodles","bread","coconut milk","soy sauce",
  "sesame oil","honey","yogurt","walnuts","almonds","cashews","peanuts","sweet potato"
];

const INGREDIENT_CATEGORIES = {
  "Proteins": ["chicken","beef","fish","tofu","paneer","egg","lentils","chickpeas","peanuts","almonds","walnuts","cashews"],
  "Vegetables": ["tomato","onion","garlic","ginger","spinach","mushroom","bell pepper","carrot","potato","cauliflower","broccoli","zucchini","corn","peas","celery","kale","lettuce","arugula","avocado","cucumber","sweet potato"],
  "Grains & Pasta": ["pasta","rice","quinoa","noodles","bread"],
  "Dairy": ["butter","cream","milk","cheese","yogurt"],
  "Oils & Condiments": ["olive oil","sesame oil","soy sauce","honey","coconut milk"],
  "Spices & Herbs": ["coriander","cumin","turmeric","paprika","chili","black pepper","basil","oregano","lemon"],
};

const RECIPES = [
{
id:1,
name:"Mughlai Salad Non Veg",
type:"non-veg",
time:20,
calories:160,
protein:18,
carbs:12,
fat:5,
price:6.7,
rating:4,
image:"🥗",
ingredients:["chicken","lettuce","tomato","onion","lemon","olive oil","salt","black pepper","coriander"],
category:"Salad",
description:"A light Mughlai-style chicken salad with fresh herbs and citrus dressing.",
steps:[
"Grill or boil chicken and shred it.",
"Chop lettuce, tomato, and onion.",
"Mix vegetables with chicken in a bowl.",
"Add olive oil, lemon juice, salt, and pepper.",
"Garnish with coriander and serve fresh."
]
},
{
id:2,
name:"Russian Salad Veg",
type:"veg",
time:30,
calories:320,
protein:12,
carbs:55,
fat:22,
price:7.8,
rating:5,
image:"🥙",
ingredients:["potato","carrot","peas","cucumber","onion","yogurt","black pepper","lemon"],
category:"Salad",
description:"Creamy vegetable salad with yogurt dressing and mild spices.",
steps:[
"Boil potato, carrot, and peas until soft.",
"Dice vegetables into small cubes.",
"Mix with yogurt, lemon juice, and pepper.",
"Chill for 10 minutes before serving."
]
},
{
id:3,
name:"Soya Protein Salad Veg",
type:"veg",
time:15,
calories:280,
protein:28,
carbs:30,
fat:14,
price:4.5,
rating:4,
image:"🥬",
ingredients:["tofu","spinach","tomato","bell pepper","olive oil","soy sauce","garlic","sesame oil","lemon"],
category:"Salad",
description:"High-protein tofu salad with Asian-inspired flavors.",
steps:[
"Cube tofu and lightly sauté with garlic.",
"Chop vegetables and add to a bowl.",
"Mix tofu with veggies.",
"Add soy sauce, lemon, and sesame oil.",
"Toss well and serve."
]
},
{
id:4,
name:"Chicken Noodle Soup",
type:"non-veg",
time:45,
calories:320,
protein:24,
carbs:40,
fat:8,
price:8.5,
rating:5,
image:"🍜",
ingredients:["chicken","noodles","carrot","celery","onion","garlic","black pepper","basil"],
category:"Soup",
description:"Comforting chicken soup with noodles and herbs.",
steps:[
"Boil chicken with spices to make broth.",
"Add chopped vegetables and cook.",
"Add noodles and simmer.",
"Shred chicken and mix back in.",
"Serve hot."
]
},
{
id:5,
name:"Mushroom Herb Soup",
type:"veg",
time:25,
calories:180,
protein:6,
carbs:22,
fat:9,
price:5.9,
rating:4,
image:"🍲",
ingredients:["mushroom","onion","garlic","butter","cream","oregano","black pepper","basil"],
category:"Soup",
description:"Creamy mushroom soup with herbs and spices.",
steps:[
"Sauté garlic and onion in butter.",
"Add mushrooms and cook until soft.",
"Add water or stock and simmer.",
"Blend slightly and add cream.",
"Season and serve."
]
},
{
id:6,
name:"Grilled Fish Tacos",
type:"non-veg",
time:35,
calories:450,
protein:32,
carbs:38,
fat:16,
price:10.5,
rating:5,
image:"🌮",
ingredients:["fish","corn","tomato","avocado","lemon","coriander","chili","olive oil"],
category:"Fish",
description:"Fresh grilled fish tacos with tangy toppings.",
steps:[
"Season and grill fish.",
"Prepare salsa with tomato, corn, and avocado.",
"Warm tortillas.",
"Assemble fish and toppings.",
"Serve with lemon."
]
},
{
id:7,
name:"Veggie Burger",
type:"veg",
time:30,
calories:520,
protein:18,
carbs:62,
fat:20,
price:9.0,
rating:4,
image:"🍔",
ingredients:["chickpeas","onion","garlic","bell pepper","bread","lettuce","tomato","cheese","cumin"],
category:"Burger",
description:"Crispy chickpea-based veggie burger.",
steps:[
"Mash chickpeas and mix with spices.",
"Form patties and pan-fry.",
"Toast buns.",
"Assemble with veggies and cheese.",
"Serve hot."
]
},
{
id:8,
name:"Beef Burger Deluxe",
type:"non-veg",
time:25,
calories:680,
protein:42,
carbs:48,
fat:30,
price:12.0,
rating:5,
image:"🍔",
ingredients:["beef","onion","garlic","bread","lettuce","tomato","cheese","butter","black pepper"],
category:"Burger",
description:"Juicy beef burger with classic toppings.",
steps:[
"Season beef and form patties.",
"Grill or pan-fry patties.",
"Toast buns with butter.",
"Assemble burger with toppings.",
"Serve immediately."
]
},
{
id:9,
name:"Pad Thai Noodles",
type:"veg",
time:20,
calories:560,
protein:16,
carbs:72,
fat:18,
price:8.0,
rating:4,
image:"🍝",
ingredients:["noodles","tofu","egg","onion","garlic","soy sauce","lemon","peanuts","chili","sesame oil"],
category:"Noodle",
description:"Classic Thai noodles with tangy and nutty flavors.",
steps:[
"Boil noodles and drain.",
"Sauté garlic, onion, and tofu.",
"Add egg and scramble.",
"Mix noodles with sauce and peanuts.",
"Cook briefly and serve."
]
},
{
id:10,
name:"Paneer Tikka",
type:"veg",
time:40,
calories:380,
protein:22,
carbs:18,
fat:24,
price:7.5,
rating:5,
image:"🧀",
ingredients:["paneer","yogurt","bell pepper","onion","tomato","turmeric","cumin","coriander","chili","lemon"],
category:"Herbs",
description:"Spiced grilled paneer cubes with smoky flavor.",
steps:[
"Marinate paneer with yogurt and spices.",
"Skewer with vegetables.",
"Grill or bake until golden.",
"Serve with lemon."
]
},
{
id:11,
name:"Quinoa Buddha Bowl",
type:"veg",
time:25,
calories:420,
protein:20,
carbs:52,
fat:14,
price:9.5,
rating:5,
image:"🥣",
ingredients:["quinoa","spinach","avocado","tomato","cucumber","chickpeas","lemon","olive oil","paprika"],
category:"Salad",
description:"Healthy bowl with quinoa, veggies, and protein.",
steps:[
"Cook quinoa.",
"Chop vegetables.",
"Assemble everything in a bowl.",
"Add dressing and serve."
]
},
{
id:12,
name:"Chicken Tikka Masala",
type:"non-veg",
time:55,
calories:520,
protein:36,
carbs:28,
fat:26,
price:11.0,
rating:5,
image:"🍛",
ingredients:["chicken","tomato","onion","garlic","ginger","cream","butter","cumin","turmeric","coriander","chili"],
category:"Herbs",
description:"Rich and creamy Indian curry with tender chicken.",
steps:[
"Marinate and grill chicken.",
"Prepare tomato gravy with spices.",
"Add chicken and simmer.",
"Finish with cream and butter.",
"Serve hot."
]
},
{
id:13,
name:"Lentil Dal Soup",
type:"veg",
time:35,
calories:280,
protein:16,
carbs:42,
fat:6,
price:5.5,
rating:4,
image:"🫕",
ingredients:["lentils","tomato","onion","garlic","ginger","turmeric","cumin","coriander","lemon"],
category:"Soup",
description:"Simple and nutritious lentil-based Indian soup.",
steps:[
"Boil lentils until soft.",
"Prepare tempering with spices.",
"Mix lentils with tempering.",
"Simmer and serve with lemon."
]
},
{
id:14,
name:"Fried Rice Bowl",
type:"non-veg",
time:20,
calories:490,
protein:28,
carbs:58,
fat:14,
price:10.0,
rating:4,
image:"🍚",
ingredients:["rice","egg","onion","garlic","soy sauce","sesame oil","peas","carrot"],
category:"Herbs",
description:"Quick stir-fried rice with eggs and vegetables.",
steps:[
"Cook rice and cool.",
"Sauté garlic and vegetables.",
"Add egg and scramble.",
"Mix in rice and soy sauce.",
"Stir-fry and serve."
]
},
{
id:15,
name:"Avocado Toast",
type:"veg",
time:10,
calories:320,
protein:8,
carbs:36,
fat:18,
price:6.0,
rating:4,
image:"🥑",
ingredients:["avocado","bread","tomato","lemon","black pepper","chili","olive oil","arugula"],
category:"Herbs",
description:"Simple and healthy avocado toast with seasoning.",
steps:[
"Toast the bread.",
"Mash avocado with lemon and spices.",
"Spread on toast.",
"Top with tomato and greens.",
"Serve immediately."
]
}
];


const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MEAL_TYPES = ["Breakfast","Lunch","Dinner","Snack"];
const DAILY_GOALS = { calories:2000, protein:120, carbs:250, fat:65 };
const CATEGORIES = ["All","Salad","Soup","Herbs","Fish","Burger","Noodle"];
const CAT_ICONS = { All:"🍴", Salad:"🥗", Soup:"🍲", Herbs:"🌿", Fish:"🐟", Burger:"🍔", Noodle:"🍜" };
const MEAL_ICONS = { Breakfast:"🌅", Lunch:"☀️", Dinner:"🌙", Snack:"🍎" };
const NAV_ITEMS = [
  { label:"Dashboard", icon:"⊞" },
  { label:"Recipes", icon:"🍽" },
  { label:"Meal Planner", icon:"📅" },
  { label:"Shopping List", icon:"🛒" },
];

// ─── FIX: correct today mapping ───────────────────────────────────────────────
// JS getDay() returns 0=Sun, 1=Mon...6=Sat. DAYS array is Mon=0...Sun=6.
function getTodayName() {
  const d = new Date().getDay(); // 0 = Sunday
  return DAYS[d === 0 ? 6 : d - 1];
}

// ─── STATE ───────────────────────────────────────────────────────────────────

const mkPlanner = () => DAYS.reduce((a,d) => { a[d] = MEAL_TYPES.reduce((m,t) => { m[t]=[]; return m; },{}); return a; },{});

const loadLS = () => { try { const s = localStorage.getItem("srb2"); return s ? JSON.parse(s) : null; } catch { return null; } };

const initial = (() => {
  const saved = loadLS();
  return {
    ingredients: [],
    planner: saved?.planner || mkPlanner(),
    dark: saved?.dark || false,
    nav: "Dashboard",
    filters: { type:"all", maxCal:800, maxTime:120 },
    shoppingChecked: {},
    shoppingExtras: [],   // NEW: manually added shopping items
    shoppingHidden: [],
  };
})();

function reducer(s, a) {
switch(a.type) {
case "ADD_ING":
return s.ingredients.includes(a.v) ? s : {...s, ingredients:[...s.ingredients, a.v]};


case "DEL_ING": 
  return {...s, ingredients: s.ingredients.filter((_,i)=>i!==a.i)};

case "CLEAR_ING": 
  return {...s, ingredients:[]};

case "ADD_MEAL": {
  const {day,mt,recipe} = a;
  if(s.planner[day][mt].find(r=>r.id===recipe.id)) return s;
  return {
    ...s,
    planner:{
      ...s.planner,
      [day]:{
        ...s.planner[day],
        [mt]:[...s.planner[day][mt],recipe]
      }
    }
  };
}

case "DEL_MEAL": {
  const {day,mt,id} = a;
  return {
    ...s,
    planner:{
      ...s.planner,
      [day]:{
        ...s.planner[day],
        [mt]:s.planner[day][mt].filter(r=>r.id!==id)
      }
    }
  };
}

case "MOVE_MEAL": {
  const {fd,fmt,td,tmt,recipe} = a;
  const from = s.planner[fd][fmt].filter(r=>r.id!==recipe.id);
  const to = s.planner[td][tmt];
  if(to.find(r=>r.id===recipe.id)) return s;

  return {
    ...s,
    planner:{
      ...s.planner,
      [fd]:{...s.planner[fd],[fmt]:from},
      [td]:{...s.planner[td],[tmt]:[...to,recipe]}
    }
  };
}

case "SET_FILTER": 
  return {...s, filters:{...s.filters,...a.v}};

case "TOGGLE_DARK": 
  return {...s, dark:!s.dark};

case "SET_NAV": 
  return {...s, nav:a.v};

case "TOGGLE_SHOP": 
  return {
    ...s,
    shoppingChecked:{
      ...s.shoppingChecked,
      [a.v]:!s.shoppingChecked[a.v]
    }
  };

case "ADD_SHOP_EXTRA": 
  return s.shoppingExtras.includes(a.v)
    ? s
    : {...s, shoppingExtras:[...s.shoppingExtras, a.v]};

case "DEL_SHOP_EXTRA": 
  return {
    ...s,
    shoppingExtras: s.shoppingExtras.filter(x=>x!==a.v),
    shoppingChecked:{
      ...s.shoppingChecked,
      [a.v]:undefined
    }
  };

// ✅ FIXED DELETE (WORKS FOR ALL ITEMS)
case "DELETE_SHOP_ITEM": {
  const newChecked = {...s.shoppingChecked};
  delete newChecked[a.v];

  return {
    ...s,
    shoppingChecked: newChecked,
    shoppingExtras: s.shoppingExtras.filter(i => i !== a.v)
  };
}

default: 
  return s;


}
}


const Ctx = createContext(null);
function useApp() { return useContext(Ctx); }

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Stars({n}) {
  return <span>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?"#fbbf24":"#e5e7eb",fontSize:11}}>★</span>)}</span>;
}

function CircularProgress({value,max,size=88,stroke=8}) {
  const r=(size-stroke)/2, c=2*Math.PI*r, pct=Math.min(value/max,1);
  const color=pct>1?"#ef4444":pct>0.8?"#f59e0b":pct>0.5?"#22c55e":"#fbbf24";
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#fde68a" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-pct)}
        style={{transition:"stroke-dashoffset 0.7s ease-out"}}/>
    </svg>
  );
}

function MacroBar({label,value,max,color}) {
  const pct=Math.min((value/max)*100,100);
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
        <span style={{fontWeight:600}}>{label}</span>
        <span style={{color:"#9ca3af"}}>{value}g / {max}g</span>
      </div>
      <div style={{height:6,background:"#f3f4f6",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width 0.7s ease-out"}}/>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar() {
  const {state,dispatch} = useApp();
  return (
    <aside style={{width:220,flexShrink:0,display:"flex",flexDirection:"column",background:state.dark?"#111827":"#fff",borderRight:"1px solid",borderColor:state.dark?"#1f2937":"#fef3c7",height:"100vh",overflowY:"auto"}}>
      {/* Logo */}
      <div style={{padding:"20px 20px 16px",borderBottom:"1px solid",borderColor:state.dark?"#1f2937":"#fef3c7"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#fcd34d,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🍴</div>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:state.dark?"#f9fafb":"#111827"}}>Smart Recipe</div>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>Builder & Planner</div>
          </div>
        </div>
      </div>
      {/* User */}
      <div style={{padding:"14px 20px",borderBottom:"1px solid",borderColor:state.dark?"#1f2937":"#fef3c7",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#fcd34d,#f59e0b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:"2px solid #fde68a"}}>👩‍🍳</div>
        <div>
          <div style={{fontWeight:600,fontSize:13,color:state.dark?"#f9fafb":"#111827"}}>Hello, Sabrina</div>
          <span style={{fontSize:10,background:"#fef3c7",color:"#d97706",padding:"2px 8px",borderRadius:99,fontWeight:600}}>Plan · Paid</span>
        </div>
      </div>
      {/* Nav */}
      <nav style={{flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:4}}>
        {NAV_ITEMS.map(item=>{
          const active = state.nav===item.label;
          return (
            <button key={item.label} onClick={()=>dispatch({type:"SET_NAV",v:item.label})}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:14,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,textAlign:"left",transition:"all 0.2s",
                background:active?"#fbbf24":"transparent",
                color:active?"#fff":state.dark?"#9ca3af":"#6b7280",
                boxShadow:active?"0 4px 12px rgba(251,191,36,0.3)":"none"
              }}>
              <span style={{fontSize:16}}>{item.icon}</span>{item.label}
            </button>
          );
        })}
      </nav>
      {/* Dark mode toggle — MasterCard removed */}
      <div style={{padding:"12px",borderTop:"1px solid",borderColor:state.dark?"#1f2937":"#fef3c7"}}>
        <button onClick={()=>dispatch({type:"TOGGLE_DARK"})}
          style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:14,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:state.dark?"#1f2937":"#fffbeb",color:state.dark?"#fbbf24":"#6b7280"}}>
          <span style={{fontSize:16}}>{state.dark?"☀️":"🌙"}</span>{state.dark?"Light Mode":"Dark Mode"}
        </button>
      </div>
    </aside>
  );
}

// ─── INGREDIENT INPUT ─────────────────────────────────────────────────────────

function IngredientInput() {
  const {state,dispatch} = useApp();
  const [inp,setInp] = useState("");
  const [showSug,setShowSug] = useState(false);
  const [hi,setHi] = useState(-1);
  const ref = useRef();
  const dark = state.dark;

  const sugs = useMemo(()=>{
    if(!inp.trim()) return [];
    return INGREDIENT_SUGGESTIONS.filter(s=>s.toLowerCase().includes(inp.toLowerCase())&&!state.ingredients.includes(s)).slice(0,6);
  },[inp,state.ingredients]);

  const add = v => { const c=v.trim().toLowerCase(); if(!c) return; dispatch({type:"ADD_ING",v:c}); setInp(""); setShowSug(false); setHi(-1); ref.current?.focus(); };

  const onKey = e => {
    if(e.key==="Enter"){e.preventDefault(); hi>=0&&sugs[hi]?add(sugs[hi]):inp.trim()&&add(inp);}
    else if(e.key==="Backspace"&&!inp&&state.ingredients.length>0) dispatch({type:"DEL_ING",i:state.ingredients.length-1});
    else if(e.key==="ArrowDown"){e.preventDefault();setHi(i=>Math.min(i+1,sugs.length-1));}
    else if(e.key==="ArrowUp"){e.preventDefault();setHi(i=>Math.max(i-1,-1));}
    else if(e.key==="Escape") setShowSug(false);
  };

  const CHIP_BG = ["#fef3c7","#ffedd5","#fefce8","#dcfce7","#ede9fe"];
  const CHIP_C  = ["#d97706","#c2410c","#ca8a04","#16a34a","#7c3aed"];

  return (
    <div style={{background:dark?"#1f2937":"#fff",borderRadius:20,padding:16,border:"1px solid",borderColor:dark?"#374151":"#fde68a",marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontWeight:700,fontSize:13,color:dark?"#f9fafb":"#111827"}}>🧪 What's in your fridge?</span>
        {state.ingredients.length>0&&<button onClick={()=>dispatch({type:"CLEAR_ING"})} style={{fontSize:11,color:"#9ca3af",border:"none",background:"none",cursor:"pointer"}}>Clear all</button>}
      </div>
      <div onClick={()=>ref.current?.focus()} style={{display:"flex",flexWrap:"wrap",gap:6,minHeight:44,borderRadius:14,border:"2px dashed",borderColor:dark?"#374151":"#fde68a",background:"rgba(251,191,36,0.05)",padding:10,cursor:"text"}}>
        {state.ingredients.map((ing,i)=>(
          <span key={ing} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:99,fontSize:11,fontWeight:600,background:CHIP_BG[i%5],color:CHIP_C[i%5],animation:"popIn 0.25s ease-out"}}>
            {ing}
            <button onClick={e=>{e.stopPropagation();dispatch({type:"DEL_ING",i});}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"inherit",lineHeight:1,padding:0}}>×</button>
          </span>
        ))}
        <input ref={ref} value={inp} onChange={e=>{setInp(e.target.value);setShowSug(true);setHi(-1);}}
          onKeyDown={onKey} onFocus={()=>setShowSug(true)} onBlur={()=>setTimeout(()=>setShowSug(false),150)}
          placeholder={state.ingredients.length===0?"Type an ingredient, press Enter…":"Add more…"}
          style={{flex:1,minWidth:120,background:"transparent",border:"none",outline:"none",fontSize:12,color:dark?"#d1d5db":"#374151"}}/>
      </div>
      {showSug&&sugs.length>0&&(
        <div style={{marginTop:6,borderRadius:14,border:"1px solid",borderColor:dark?"#374151":"#fde68a",background:dark?"#1f2937":"#fff",overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          {sugs.map((s,i)=>(
            <button key={s} onMouseDown={()=>add(s)}
              style={{width:"100%",textAlign:"left",padding:"9px 14px",fontSize:12,border:"none",cursor:"pointer",background:i===hi?"#fbbf24":dark?"#1f2937":"#fff",color:i===hi?"#fff":dark?"#d1d5db":"#374151",display:"flex",alignItems:"center",gap:8}}>
              <span style={{opacity:0.5,fontSize:13}}>🥄</span>{s}
            </button>
          ))}
        </div>
      )}
      {state.ingredients.length>0&&<p style={{fontSize:10,color:"#9ca3af",textAlign:"center",marginTop:6}}>{state.ingredients.length} ingredient{state.ingredients.length>1?"s":""} · Backspace removes last</p>}
    </div>
  );
}

// ─── RECIPE CARD ─────────────────────────────────────────────────────────
function RecipeCard({recipe, quickAddDay}) {
const {dispatch,state} = useApp();
const [menu,setMenu] = useState(false);
const [day,setDay] = useState(quickAddDay || "Monday");
const [mt,setMt] = useState("Lunch");
const [added,setAdded] = useState(false);
const [showRecipe,setShowRecipe] = useState(false);

const dark = state.dark;
const matchColor = recipe.matchPct>=80?"#22c55e":recipe.matchPct>=50?"#f59e0b":"#9ca3af";

useEffect(()=>{ if(quickAddDay) setDay(quickAddDay); },[quickAddDay]);

const confirm = () => {
dispatch({type:"ADD_MEAL",day,mt,recipe});
setAdded(true);
setTimeout(()=>{setAdded(false);setMenu(false);},1000);
};

const btnBase = {
padding:"9px",
borderRadius:14,
fontWeight:700,
cursor:"pointer",
fontSize:12,
transition:"all 0.2s ease"
};

return (
<>
<div style={{
background:dark?"#1f2937":"#fff",
borderRadius:20,
border:"1px solid",
borderColor:dark?"#374151":"#fde68a",
padding:14,
position:"relative",
transition:"all 0.2s",
boxShadow:"0 4px 18px rgba(251,191,36,0.12)"
}}>


    {recipe.matchPct<100&&(
      <div style={{
        position:"absolute",
        top:10,right:10,
        fontSize:10,fontWeight:700,
        color:matchColor,
        background:dark?"#111827":"#fff",
        border:`1px solid ${matchColor}`,
        borderRadius:99,
        padding:"2px 7px"
      }}>
        {recipe.matchPct}%
      </div>
    )}

    {/* HEADER */}
    <div style={{display:"flex",gap:12,alignItems:"center"}}>
      <div style={{
        width:60,height:60,
        borderRadius:16,
        background:dark?"rgba(251,191,36,0.1)":"#fef3c7",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:28
      }}>
        {recipe.image}
      </div>

      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:700,fontSize:13}}>
              {recipe.name}
            </div>
            <div style={{fontSize:10,color:"#9ca3af"}}>
              {recipe.calories} kcal · {recipe.time} min
            </div>
          </div>
          <span style={{fontWeight:700}}>${recipe.price}</span>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          <Stars n={recipe.rating}/>
          <span style={{
            fontSize:10,
            padding:"2px 7px",
            borderRadius:99,
            fontWeight:600,
            background:recipe.type==="veg"?"#dcfce7":"#fee2e2",
            color:recipe.type==="veg"?"#16a34a":"#dc2626"
          }}>
            {recipe.type==="veg"?"🌱 Veg":"🍖 Non-Veg"}
          </span>
        </div>

        <div style={{display:"flex",gap:10,marginTop:6,fontSize:10}}>
          <span>P: <b style={{color:"#3b82f6"}}>{recipe.protein}g</b></span>
          <span>C: <b style={{color:"#f59e0b"}}>{recipe.carbs}g</b></span>
          <span>F: <b style={{color:"#f97316"}}>{recipe.fat}g</b></span>
        </div>
      </div>
    </div>

    {/* BUTTON SECTION */}
    <div style={{marginTop:12}}>

      {/* TOP BUTTONS */}
      <div style={{display:"flex",gap:8}}>

        {/* VIEW */}
        <button
          onClick={()=>setShowRecipe(true)}
          style={{
            ...btnBase,
            flex:1,
            border:"1px solid #fde68a",
            background:"#fff",
            color:"#f59e0b"
          }}
          onMouseEnter={e=>e.target.style.transform="scale(1.04)"}
          onMouseLeave={e=>e.target.style.transform="scale(1)"}
          onMouseDown={e=>e.target.style.transform="scale(0.96)"}
          onMouseUp={e=>e.target.style.transform="scale(1.04)"}
        >
          📖 View
        </button>

        {!menu && (
          <button
            onClick={()=>setMenu(true)}
            style={{
              ...btnBase,
              flex:1,
              border:"none",
              background:"#fbbf24",
              color:"#fff"
            }}
            onMouseEnter={e=>e.target.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.target.style.transform="scale(1)"}
            onMouseDown={e=>e.target.style.transform="scale(0.96)"}
            onMouseUp={e=>e.target.style.transform="scale(1.04)"}
          >
            + Add
          </button>
        )}
      </div>

      {menu && (

  <div style={{
    marginTop:10,
    padding:10,
    borderRadius:14,
    background:dark?"#111827":"#fff7ed",
    border:"1px solid #fde68a"
  }}>


{/* SINGLE ROW */}
<div style={{
  display:"flex",
  gap:6,
  alignItems:"center"
}}>

  {/* DAY */}
  <select
    value={day}
    onChange={e=>setDay(e.target.value)}
    style={{
      flex:1,
      padding:"6px 8px",
      borderRadius:12,
      border:"1px solid #fde68a",
      fontSize:12
    }}
  >
    {DAYS.map(d=><option key={d}>{d}</option>)}
  </select>

  {/* MEAL TYPE */}
  <select
    value={mt}
    onChange={e=>setMt(e.target.value)}
    style={{
      flex:1,
      padding:"6px 8px",
      borderRadius:12,
      border:"1px solid #fde68a",
      fontSize:12
    }}
  >
    {MEAL_TYPES.map(m=><option key={m}>{m}</option>)}
  </select>

  {/* CONFIRM */}
  <button
    onClick={confirm}
    style={{
      padding:"8px 14px",
      borderRadius:12,
      border:"none",
      background:added?"#22c55e":"#fbbf24",
      color:"#fff",
      fontWeight:700,
      cursor:"pointer",
      whiteSpace:"nowrap",
      transition:"all 0.2s"
    }}
  >
    {added ? "✓" : "Confirm"}
  </button>

  {/* CLOSE */}
  <button
    onClick={()=>setMenu(false)}
    style={{
      padding:"8px 10px",
      borderRadius:10,
      border:"none",
      background:"#eee",
      cursor:"pointer"
    }}
  >
    ✕
  </button>

</div>


  </div>
)}

    </div>
  </div>

  {/* MODAL */}
  {showRecipe && (
    <div
      onClick={()=>setShowRecipe(false)}
      style={{
        position:"fixed",
        top:0,left:0,right:0,bottom:0,
        background:"rgba(0,0,0,0.5)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        zIndex:999
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:420,
          maxHeight:"80vh",
          overflowY:"auto",
          background:"#fff",
          borderRadius:16,
          padding:20,
          animation:"fadeIn 0.2s ease"
        }}
      >
        <h2>{recipe.name}</h2>
        {recipe.description && <p>{recipe.description}</p>}

        <h4>Ingredients</h4>
        <ul>{recipe.ingredients.map((i,idx)=><li key={idx}>{i}</li>)}</ul>

        <h4>Steps</h4>
        <ol>{recipe.steps?.map((s,idx)=><li key={idx}>{s}</li>)}</ol>

        <button
          onClick={()=>setShowRecipe(false)}
          style={{
            marginTop:10,
            padding:"8px",
            background:"#fbbf24",
            color:"#fff",
            border:"none",
            borderRadius:10
          }}
        >
          Close
        </button>
      </div>
    </div>
  )}
</>


);
}




// ─── QUICK ADD CARD (Dashboard) ───────────────────────────────────────────────

function QuickAddCard({recipe, today}) {
  const {dispatch,state} = useApp();
  const [mt,setMt] = useState("Lunch");
  const [added,setAdded] = useState(false);
  const dark = state.dark;

  const add = () => {
    dispatch({type:"ADD_MEAL",day:today,mt,recipe});
    setAdded(true); setTimeout(()=>setAdded(false),1200);
  };

  return (
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:14,border:"1px solid",borderColor:dark?"#374151":"#fde68a",background:dark?"#111827":"#fff"}}>
      <span style={{fontSize:22,flexShrink:0}}>{recipe.image}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,fontWeight:600,color:dark?"#e5e7eb":"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{recipe.name}</div>
        <div style={{fontSize:10,color:"#9ca3af"}}>{recipe.calories} kcal</div>
      </div>
      <select value={mt} onChange={e=>setMt(e.target.value)} onClick={e=>e.stopPropagation()}
        style={{fontSize:10,borderRadius:8,border:`1px solid ${dark?"#374151":"#fde68a"}`,background:dark?"#1f2937":"#fffbeb",color:dark?"#d1d5db":"#374151",padding:"3px 5px",outline:"none",width:66,flexShrink:0}}>
        {MEAL_TYPES.map(m=><option key={m}>{m}</option>)}
      </select>
      <button onClick={add} style={{padding:"5px 8px",borderRadius:8,border:"none",background:added?"#22c55e":"#fbbf24",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0,transition:"background 0.2s",minWidth:34}}>
        {added?"✓":"+"}
      </button>
    </div>
  );
}

// ─── RECIPE LIST ──────────────────────────────────────────────────────────────

function RecipeList() {
  const {state,dispatch,filteredRecipes} = useApp();
  const [cat,setCat] = useState("All");
  const [sort,setSort] = useState("match");
  const dark = state.dark;
  const today = getTodayName();

  const shown = useMemo(()=>{
    return filteredRecipes
      .filter(r=>cat==="All"||r.category===cat)
      .sort((a,b)=>sort==="calorie"?a.calories-b.calories:sort==="price"?a.price-b.price:b.matchPct-a.matchPct);
  },[filteredRecipes,cat,sort]);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:14,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:dark?"#f9fafb":"#111827",margin:0}}>What's Healthy Today?</h1>
          <p style={{fontSize:12,color:"#9ca3af",margin:"2px 0 0"}}>{shown.length} recipes found</p>
        </div>
        <div style={{display:"flex",gap:12,fontSize:11,color:"#9ca3af",alignItems:"center"}}>
          <span><span style={{width:8,height:8,borderRadius:"50%",background:"#fbbf24",display:"inline-block",marginRight:4}}/>Meat</span>
          <span><span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",display:"inline-block",marginRight:4}}/>Veg</span>
        </div>
      </div>

      <IngredientInput/>

      {/* Category pills */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",borderRadius:16,fontSize:11,fontWeight:700,border:cat===c?"none":`1px solid ${dark?"#374151":"#fde68a"}`,cursor:"pointer",flexShrink:0,transition:"all 0.2s",
            background:cat===c?"#fbbf24":dark?"#1f2937":"#fff",
            color:cat===c?"#fff":dark?"#9ca3af":"#6b7280",
            boxShadow:cat===c?"0 4px 12px rgba(251,191,36,0.3)":"none",
            transform:cat===c?"scale(1.05)":"scale(1)"}}>
            <span style={{fontSize:18}}>{CAT_ICONS[c]}</span>{c}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        {["all","veg","non-veg"].map(t=>(
          <button key={t} onClick={()=>dispatch({type:"SET_FILTER",v:{type:t}})}
            style={{padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,border:"none",cursor:"pointer",transition:"all 0.2s",
              background:state.filters.type===t?"#fbbf24":dark?"#1f2937":"#fffbeb",
              color:state.filters.type===t?"#fff":dark?"#9ca3af":"#6b7280"}}>
            {t==="all"?"🍴 All":t==="veg"?"🌱 Veg":"🍖 Non-Veg"}
          </button>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
          <span style={{fontSize:10,color:"#9ca3af"}}>≤{state.filters.maxCal} kcal</span>
          <input type="range" min={100} max={800} step={50} value={state.filters.maxCal}
            onChange={e=>dispatch({type:"SET_FILTER",v:{maxCal:Number(e.target.value)}})}
            style={{width:80,accentColor:"#fbbf24"}}/>
          <select value={sort} onChange={e=>setSort(e.target.value)}
            style={{fontSize:11,borderRadius:10,border:`1px solid ${dark?"#374151":"#fde68a"}`,background:dark?"#1f2937":"#fff",color:dark?"#d1d5db":"#374151",padding:"4px 8px",outline:"none"}}>
            <option value="match">By Match</option>
            <option value="calorie">By Calorie</option>
            <option value="price">By Price</option>
          </select>
        </div>
      </div>

      {/* Grid — passes today so day selector defaults to current day */}
      <div style={{flex:1,overflowY:"auto",paddingRight:4}}>
        {shown.length===0?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:200,textAlign:"center"}}>
            <span style={{fontSize:48,marginBottom:10}}>🔍</span>
            <p style={{fontWeight:600,color:dark?"#6b7280":"#374151",margin:0}}>No recipes match</p>
            <p style={{fontSize:11,color:"#9ca3af",marginTop:4}}>Try adjusting ingredients or filters</p>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {shown.map(r=><RecipeCard key={r.id} recipe={r} quickAddDay={today}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PLANNER BOARD ────────────────────────────────────────────────────────────

function PlannerBoard() {
  const {state,dispatch} = useApp();
  const [dragOver,setDragOver] = useState(null);
  const [dragData,setDragData] = useState(null);
  const dark = state.dark;

  const onDragStart = (e,data) => { setDragData(data); e.dataTransfer.effectAllowed="move"; };
  const onDragOver = (e,d,mt) => { e.preventDefault(); setDragOver(`${d}-${mt}`); };
  const onDrop = (e,td,tmt) => {
    e.preventDefault();
    if(!dragData) return;
    const {recipe,day:fd,mt:fmt} = dragData;
    if(fd!==td||fmt!==tmt) dispatch({type:"MOVE_MEAL",fd,fmt,td,tmt,recipe});
    setDragOver(null); setDragData(null);
  };

  const dayKcal = d => Object.values(state.planner[d]).flat().reduce((s,m)=>s+m.calories,0);
  const today = getTodayName();

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:14}} onDragEnd={()=>{setDragOver(null);setDragData(null);}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{fontSize:20,fontWeight:800,color:dark?"#f9fafb":"#111827",margin:0}}>📅 Weekly Meal Planner</h2>
        <span style={{fontSize:11,color:"#9ca3af"}}>Drag meals between slots</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,overflowY:"auto",flex:1}}>
        {DAYS.map(day=>{
          const kcal = dayKcal(day);
          const isToday = day === today;
          return (
            <div key={day} style={{background:dark?"#1f2937":"#fff",borderRadius:18,border:`${isToday?"2px":"1px"} solid`,borderColor:isToday?"#fbbf24":dark?"#374151":"#fde68a",padding:14,boxShadow:isToday?"0 0 0 4px rgba(251,191,36,0.12)":"0 2px 12px rgba(251,191,36,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontWeight:700,fontSize:13,color:dark?"#f9fafb":"#111827"}}>
                  {day}
                  {isToday&&<span style={{marginLeft:6,fontSize:9,background:"#fbbf24",color:"#fff",padding:"1px 6px",borderRadius:99,fontWeight:700}}>TODAY</span>}
                </span>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99,background:kcal===0?dark?"#374151":"#f3f4f6":kcal>2000?"#fee2e2":dark?"rgba(251,191,36,0.15)":"#fef3c7",color:kcal===0?"#9ca3af":kcal>2000?"#dc2626":"#d97706"}}>{kcal} kcal</span>
              </div>
              {MEAL_TYPES.map(mt=>{
                const meals = state.planner[day][mt];
                const isOver = dragOver===`${day}-${mt}`;
                return (
                  <div key={mt} style={{marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                      <span style={{fontSize:11}}>{MEAL_ICONS[mt]}</span>
                      <span style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:0.5}}>{mt}</span>
                      {meals.length>0&&<span style={{marginLeft:"auto",fontSize:9,fontWeight:700,color:"#d97706",background:"#fef3c7",padding:"1px 5px",borderRadius:99}}>{meals.reduce((s,m)=>s+m.calories,0)}</span>}
                    </div>
                    <div onDragOver={e=>onDragOver(e,day,mt)} onDrop={e=>onDrop(e,day,mt)}
                      style={{minHeight:40,borderRadius:10,border:"2px dashed",borderColor:isOver?"#fbbf24":dark?"#374151":"#fde68a",background:isOver?dark?"rgba(251,191,36,0.1)":"rgba(251,191,36,0.05)":"transparent",padding:4,transition:"all 0.15s",transform:isOver?"scale(1.01)":"scale(1)"}}>
                      {meals.length===0?<p style={{textAlign:"center",fontSize:10,color:dark?"#4b5563":"#d1d5db",padding:"6px 0",margin:0}}>Drop here</p>:
                        meals.map(r=>(
                          <div key={r.id} draggable onDragStart={e=>onDragStart(e,{recipe:r,day,mt})}
                            style={{display:"flex",alignItems:"center",gap:6,background:dark?"#111827":"#fff",borderRadius:8,padding:"5px 6px",marginBottom:4,fontSize:11,cursor:"grab",border:"1px solid",borderColor:dark?"#374151":"#fef3c7",position:"relative"}}>
                            <span style={{fontSize:14}}>{r.image}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:600,color:dark?"#e5e7eb":"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:10}}>{r.name}</div>
                              <div style={{fontSize:9,color:"#9ca3af"}}>{r.calories} kcal</div>
                            </div>
                            <button onClick={()=>dispatch({type:"DEL_MEAL",day,mt,id:r.id})} style={{background:"none",border:"none",fontSize:11,color:"#d1d5db",cursor:"pointer",padding:0,flexShrink:0}}>✕</button>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NUTRITION PANEL ──────────────────────────────────────────────────────────

function NutritionPanel() {
  const {todayNutrition,weeklyNutrition,dailyGoals,smartSuggestions,totalPlannedMeals,state} = useApp();
  const [view,setView] = useState("today");
  const dark = state.dark;
  const n = view==="today"?todayNutrition:{calories:Math.round(weeklyNutrition.calories/7),protein:Math.round(weeklyNutrition.protein/7),carbs:Math.round(weeklyNutrition.carbs/7),fat:Math.round(weeklyNutrition.fat/7)};
  const calPct = Math.round((n.calories/dailyGoals.calories)*100);

  return (
    <aside style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>
      {smartSuggestions.map((s,i)=>(
        <div key={i} style={{borderRadius:14,padding:"10px 12px",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:6,
          background:s.type==="danger"?"#fee2e2":s.type==="warning"?"#fef3c7":"#eff6ff",
          color:s.type==="danger"?"#dc2626":s.type==="warning"?"#d97706":"#2563eb",
          border:`1px solid ${s.type==="danger"?"#fecaca":s.type==="warning"?"#fde68a":"#bfdbfe"}`}}>
          <span>{s.type==="danger"?"🚨":s.type==="warning"?"⚠️":"ℹ️"}</span>{s.msg}
        </div>
      ))}

      {/* Calorie Tracker */}
      <div style={{background:dark?"#1f2937":"#fff",borderRadius:18,border:"1px solid",borderColor:dark?"#374151":"#fde68a",padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:700,fontSize:12,color:dark?"#f9fafb":"#111827"}}>🔥 Calorie Tracker</span>
          <div style={{display:"flex",background:dark?"#111827":"#fffbeb",borderRadius:10,padding:2,gap:2}}>
            {["today","weekly"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"3px 8px",borderRadius:8,fontSize:10,fontWeight:600,border:"none",cursor:"pointer",background:view===v?"#fbbf24":"transparent",color:view===v?"#fff":dark?"#9ca3af":"#6b7280",transition:"all 0.2s"}}>{v==="today"?"Today":"Avg"}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{position:"relative",flexShrink:0}}>
            <CircularProgress value={n.calories} max={dailyGoals.calories}/>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:dark?"#f9fafb":"#111827"}}>{calPct}%</span>
              <span style={{fontSize:9,color:"#9ca3af"}}>Kcal</span>
            </div>
          </div>
          <div style={{fontSize:11,flex:1}}>
            {[["Consumed",n.calories,dark?"#f9fafb":"#111827"],["Goal",dailyGoals.calories,"#f59e0b"],["Left",Math.max(0,dailyGoals.calories-n.calories),dailyGoals.calories-n.calories<0?"#ef4444":"#22c55e"]].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:"#9ca3af"}}>{l}</span><span style={{fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Macros */}
      <div style={{background:dark?"#1f2937":"#fff",borderRadius:18,border:"1px solid",borderColor:dark?"#374151":"#fde68a",padding:14}}>
        <span style={{fontWeight:700,fontSize:12,color:dark?"#f9fafb":"#111827",display:"block",marginBottom:12}}>📊 Macros</span>
        <MacroBar label="Protein" value={n.protein} max={dailyGoals.protein} color="#3b82f6"/>
        <MacroBar label="Carbs" value={n.carbs} max={dailyGoals.carbs} color="#f59e0b"/>
        <MacroBar label="Fat" value={n.fat} max={dailyGoals.fat} color="#f97316"/>
      </div>

      {/* Weekly stats */}
      <div style={{borderRadius:18,padding:14,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#fff"}}>
        <span style={{fontWeight:700,fontSize:12,display:"block",marginBottom:10}}>📋 This Week</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["🍽","Meals",totalPlannedMeals],["🔥","Calories",weeklyNutrition.calories],["📅","Avg/Day",Math.round(weeklyNutrition.calories/7)],["💪","Protein",`${weeklyNutrition.protein}g`]].map(([ic,l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"8px 10px"}}>
              <div style={{fontSize:10,opacity:0.85}}>{ic} {l}</div>
              <div style={{fontWeight:700,fontSize:16}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── SHOPPING LIST ────────────────────────────────────────────────────────────

function ShoppingList() {
const {shoppingList,state,dispatch} = useApp();
const [newItem,setNewItem] = useState("");
const dark = state.dark;

// ✅ SAFE MERGE + DELETE LOGIC
const allItems = useMemo(()=>{
const merged = {...(shoppingList || {})};


(state.shoppingExtras || []).forEach(e=>{
  if(!merged[e]) merged[e]=0;
});

(state.shoppingHidden || []).forEach(h=>{
  delete merged[h];
});

return merged;


},[shoppingList,state.shoppingExtras,state.shoppingHidden]);

// ✅ GROUPING
const grouped = useMemo(()=>{
const g={};


Object.entries(allItems).forEach(([ing,cnt])=>{
  let cat="Other";

  Object.entries(INGREDIENT_CATEGORIES || {}).forEach(([c,items])=>{
    if(items.includes(ing)) cat=c;
  });

  if(!g[cat]) g[cat]=[];
  g[cat].push({ing,cnt});
});

return g;


},[allItems]);

const total = Object.keys(allItems).length;
const checked = Object.keys(allItems).filter(k=>state.shoppingChecked?.[k]).length;

const CAT_ICONS_SHOP = {
"Proteins":"🥩",
"Vegetables":"🥦",
"Grains & Pasta":"🌾",
"Dairy":"🥛",
"Oils & Condiments":"🫙",
"Spices & Herbs":"🌿",
"Other":"📦"
};

const addExtra = () => {
const v = newItem.trim().toLowerCase();
if(!v) return;
dispatch({type:"ADD_SHOP_EXTRA",v});
setNewItem("");
};

return (
<div style={{maxWidth:600,margin:"0 auto"}}>


  {/* HEADER */}
  <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
    <div>
      <h2 style={{fontSize:22,fontWeight:800}}>🛒 Shopping List</h2>
      <p style={{fontSize:12,color:"#9ca3af"}}>
        {checked}/{total} items checked
      </p>
    </div>
  </div>

  {/* ADD ITEM */}
  <div style={{display:"flex",gap:8,marginBottom:20}}>
    <input
      value={newItem}
      onChange={e=>setNewItem(e.target.value)}
      onKeyDown={e=>e.key==="Enter"&&addExtra()}
      placeholder="Add a custom item…"
      style={{
        flex:1,
        padding:"8px 12px",
        borderRadius:12,
        border:"1px solid #fde68a"
      }}
    />
    <button
      onClick={addExtra}
      style={{
        padding:"8px 16px",
        borderRadius:12,
        border:"none",
        background:"#fbbf24",
        color:"#fff",
        fontWeight:700,
        cursor:"pointer",
        transition:"transform 0.15s"
      }}
      onMouseDown={e=>e.target.style.transform="scale(0.95)"}
      onMouseUp={e=>e.target.style.transform="scale(1)"}
    >
      + Add
    </button>
  </div>

  {/* EMPTY STATE */}
  {total===0 ? (
    <div style={{textAlign:"center",marginTop:40}}>
      <h3>Shopping list is empty</h3>
    </div>
  ) : (

    Object.entries(grouped).map(([cat,items])=>(
      <div key={cat} style={{marginBottom:20}}>

        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <span>{CAT_ICONS_SHOP[cat]}</span>
          <span style={{fontWeight:700,fontSize:12}}>{cat}</span>
        </div>

        <div style={{display:"grid",gap:6}}>

          {items.map(({ing,cnt})=>{
            const isChecked = state.shoppingChecked?.[ing];

            return (
              <div
                key={ing}
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:6,
                  padding:"8px 10px",
                  borderRadius:14,
                  border:"1px solid #fde68a",
                  background:isChecked?"#f0fdf4":"#fff",
                  transition:"all 0.2s"
                }}
              >

                {/* CHECK */}
                <button
                  onClick={()=>dispatch({type:"TOGGLE_SHOP",v:ing})}
                  style={{
                    width:18,
                    height:18,
                    borderRadius:"50%",
                    border:"2px solid #fbbf24",
                    background:isChecked?"#22c55e":"transparent",
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                />

                {/* NAME */}
                <span style={{
                  flex:1,
                  textTransform:"capitalize",
                  textDecoration:isChecked?"line-through":"none",
                  color:isChecked?"#9ca3af":"#111827"
                }}>
                  {ing}
                </span>

                {/* COUNT */}
                {cnt>1 && (
                  <span style={{
                    fontSize:10,
                    background:"#fef3c7",
                    padding:"2px 6px",
                    borderRadius:99
                  }}>
                    ×{cnt}
                  </span>
                )}

                {/* DELETE */}
                <button
                  onClick={()=>dispatch({type:"DELETE_SHOP_ITEM",v:ing})}
                  style={{
                    background:"none",
                    border:"none",
                    cursor:"pointer",
                    color:"#9ca3af",
                    fontSize:14,
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e=>e.target.style.color="#ef4444"}
                  onMouseLeave={e=>e.target.style.color="#9ca3af"}
                >
                  ✕
                </button>

              </div>
            );
          })}

        </div>
      </div>
    ))
  )}
</div>


);
}



// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function Dashboard() {
  const {state,dispatch,todayNutrition,weeklyNutrition,totalPlannedMeals,shoppingList,filteredRecipes} = useApp();
  const dark = state.dark;
  const today = getTodayName();
  const todayMeals = Object.values(state.planner[today]||{}).flat();
  const calPct = Math.round((todayNutrition.calories/DAILY_GOALS.calories)*100);

  const stats = [
    {icon:"🔥",label:"Calories Today",val:todayNutrition.calories,sub:`/ ${DAILY_GOALS.calories} kcal (${calPct}%)`,bg:dark?"rgba(251,191,36,0.1)":"#fffbeb"},
    {icon:"💪",label:"Protein Today",val:`${todayNutrition.protein}g`,sub:`/ ${DAILY_GOALS.protein}g`,bg:dark?"rgba(59,130,246,0.1)":"#eff6ff"},
    {icon:"📅",label:"Meals Planned",val:totalPlannedMeals,sub:"across the week",bg:dark?"rgba(34,197,94,0.1)":"#f0fdf4"},
    {icon:"🛒",label:"Shopping Items",val:Object.keys(shoppingList).length,sub:"ingredients needed",bg:dark?"rgba(139,92,246,0.1)":"#faf5ff"},
  ];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}}>
      <div>
        <h1 style={{fontSize:22,fontWeight:800,color:dark?"#f9fafb":"#111827",margin:0}}>👋 Welcome back, Sabrina!</h1>
        <p style={{fontSize:12,color:"#9ca3af",margin:"4px 0 0"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · Today is {today}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:dark?"#1f2937":"#fff",borderRadius:18,border:"1px solid",borderColor:dark?"#374151":"#fde68a",padding:14,display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(251,191,36,0.06)"}}>
            <div style={{width:44,height:44,borderRadius:14,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>{s.label}</div>
              <div style={{fontSize:20,fontWeight:800,color:dark?"#f9fafb":"#111827",lineHeight:1.2}}>{s.val}</div>
              <div style={{fontSize:10,color:"#9ca3af"}}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's meals */}
      <div style={{background:dark?"#1f2937":"#fff",borderRadius:18,border:"1px solid",borderColor:dark?"#374151":"#fde68a",padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:700,fontSize:14,color:dark?"#f9fafb":"#111827"}}>📋 Today's Meals ({today})</span>
          <button onClick={()=>dispatch({type:"SET_NAV",v:"Meal Planner"})} style={{fontSize:11,color:"#f59e0b",border:"none",background:"none",cursor:"pointer",fontWeight:600}}>Edit →</button>
        </div>
        {todayMeals.length===0?(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <span style={{fontSize:36}}>🍽</span>
            <p style={{fontSize:12,color:"#9ca3af",margin:"8px 0 0"}}>No meals planned for {today}</p>
            <button onClick={()=>dispatch({type:"SET_NAV",v:"Recipes"})} style={{marginTop:10,padding:"7px 16px",background:"#fbbf24",border:"none",borderRadius:10,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>Browse Recipes</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
            {todayMeals.map((m,i)=>(
              <div key={`${m.id}-${i}`} style={{display:"flex",alignItems:"center",gap:10,background:dark?"#111827":"#fffbeb",borderRadius:12,padding:10,border:"1px solid",borderColor:dark?"#374151":"#fef3c7"}}>
                <span style={{fontSize:22}}>{m.image}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:dark?"#e5e7eb":"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
                  <div style={{fontSize:10,color:"#9ca3af"}}>{m.calories} kcal</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add to today */}
      <div style={{background:dark?"#1f2937":"#fff",borderRadius:18,border:"1px solid",borderColor:dark?"#374151":"#fde68a",padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontWeight:700,fontSize:14,color:dark?"#f9fafb":"#111827"}}>⭐ Quick Add to Today</span>
          <button onClick={()=>dispatch({type:"SET_NAV",v:"Recipes"})} style={{fontSize:11,color:"#f59e0b",border:"none",background:"none",cursor:"pointer",fontWeight:600}}>See all →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>
          {filteredRecipes.slice(0,6).map(r=><QuickAddCard key={r.id} recipe={r} today={today}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── PROVIDER + APP ───────────────────────────────────────────────────────────

function Provider({children}) {
  const [state,dispatch] = useReducer(reducer,initial);

  useEffect(()=>{
    try { localStorage.setItem("srb2",JSON.stringify({planner:state.planner,dark:state.dark})); } catch {}
  },[state.planner,state.dark]);

  const filteredRecipes = useMemo(()=>{
    const ing = state.ingredients.map(i=>i.toLowerCase());
    return RECIPES.map(r=>{
      const matched = ing.length ? r.ingredients.filter(i=>ing.includes(i.toLowerCase())).length : r.ingredients.length;
      const pct = ing.length ? Math.round((matched/r.ingredients.length)*100) : 100;
      return {...r,matchPct:pct};
    }).filter(r=>{
      if(state.filters.type!=="all"&&r.type!==state.filters.type) return false;
      if(r.calories>state.filters.maxCal) return false;
      if(ing.length>0&&r.matchPct===0) return false;
      return true;
    }).sort((a,b)=>b.matchPct-a.matchPct);
  },[state.ingredients,state.filters]);

  const weeklyNutrition = useMemo(()=>{
    const t={calories:0,protein:0,carbs:0,fat:0};
    Object.values(state.planner).forEach(d=>Object.values(d).flat().forEach(m=>{t.calories+=m.calories;t.protein+=m.protein;t.carbs+=m.carbs;t.fat+=m.fat;}));
    return t;
  },[state.planner]);

  // FIX: use getTodayName() consistently
  const todayNutrition = useMemo(()=>{
    const today = getTodayName();
    const t={calories:0,protein:0,carbs:0,fat:0};
    if(state.planner[today]) Object.values(state.planner[today]).flat().forEach(m=>{t.calories+=m.calories;t.protein+=m.protein;t.carbs+=m.carbs;t.fat+=m.fat;});
    return t;
  },[state.planner]);

  const shoppingList = useMemo(()=>{
    const all={};
    Object.values(state.planner).forEach(d=>Object.values(d).flat().forEach(m=>m.ingredients.forEach(i=>{all[i]=(all[i]||0)+1;})));
    return all;
  },[state.planner]);

  const totalPlannedMeals = useMemo(()=>{
    let n=0; Object.values(state.planner).forEach(d=>Object.values(d).forEach(m=>{n+=m.length;})); return n;
  },[state.planner]);

  const smartSuggestions = useMemo(()=>{
    const s=[];
    const r=todayNutrition.calories/DAILY_GOALS.calories;
    if(r>1.1) s.push({type:"danger",msg:"Exceeded daily calorie goal!"});
    if(todayNutrition.protein<DAILY_GOALS.protein*0.5&&totalPlannedMeals>0) s.push({type:"info",msg:"Low on protein — add protein-rich meals."});
    return s;
  },[todayNutrition,totalPlannedMeals]);

  return (
    <Ctx.Provider value={{state,dispatch,filteredRecipes,weeklyNutrition,todayNutrition,shoppingList,totalPlannedMeals,smartSuggestions,dailyGoals:DAILY_GOALS}}>
      {children}
    </Ctx.Provider>
  );
}

export default function App() {
  return (
    <Provider>
      <AppInner/>
    </Provider>
  );
}

function AppInner() {
  const {state} = useApp();
  const dark = state.dark;

  const renderMain = () => {
    if(state.nav==="Dashboard") return <><Dashboard/><NutritionPanel/></>;
    if(state.nav==="Recipes") return <><RecipeList/><NutritionPanel/></>;
    if(state.nav==="Meal Planner") return <><PlannerBoard/><NutritionPanel/></>;
    if(state.nav==="Shopping List") return <><div style={{flex:1,overflowY:"auto"}}><ShoppingList/></div><NutritionPanel/></>;
    return null;
  };

  return (
    <div style={{display:"flex",height:"100vh",background:dark?"#030712":"#fffbeb",fontFamily:"'Inter','Segoe UI',sans-serif",overflow:"hidden"}}>
      <style>{`
        @keyframes popIn { from{transform:scale(0);opacity:0} 60%{transform:scale(1.1)} to{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #fcd34d; border-radius: 99px; }
        select { appearance: none; }
        button:hover { opacity: 0.9; }
      `}</style>
      <Sidebar/>
      <main style={{flex:1,display:"flex",gap:16,padding:20,overflow:"hidden"}}>
        {renderMain()}
      </main>
    </div>
  );
}
