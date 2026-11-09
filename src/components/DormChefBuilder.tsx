import React, { useState } from 'react';
import { Sparkles, Trash2, Plus, Check, Clock, Flame, Utensils, ShoppingBag, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { Ingredient, Recipe, Product, CartItem } from '../types.ts';
import { INGREDIENTS_CATALOG, RECIPES_CATALOG } from '../data/mockData.ts';

interface DormChefBuilderProps {
  onAddCustomBundleToCart: (items: { id: string; title: string; price: number; quantity: number }[]) => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const DormChefBuilder: React.FC<DormChefBuilderProps> = ({
  onAddCustomBundleToCart,
  products,
  onAddToCart,
}) => {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([
    'ing_rice',
    'ing_eggs',
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, ingredientId: string) => {
    e.dataTransfer.setData('text/plain', ingredientId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const ingredientId = e.dataTransfer.getData('text/plain');
    if (ingredientId && !selectedIngredientIds.includes(ingredientId)) {
      setSelectedIngredientIds([...selectedIngredientIds, ingredientId]);
    }
  };

  const toggleIngredient = (id: string) => {
    if (selectedIngredientIds.includes(id)) {
      setSelectedIngredientIds(selectedIngredientIds.filter((item) => item !== id));
    } else {
      setSelectedIngredientIds([...selectedIngredientIds, id]);
    }
  };

  const clearPot = () => {
    setSelectedIngredientIds([]);
  };

  // Selected ingredients objects
  const selectedIngredients = INGREDIENTS_CATALOG.filter((ing) =>
    selectedIngredientIds.includes(ing.id)
  );

  const totalPotCost = selectedIngredients.reduce((sum, item) => sum + item.price, 0);
  const totalPotCalories = selectedIngredients.reduce((sum, item) => sum + item.calories, 0);

  // Recipe matching logic
  const evaluatedRecipes = RECIPES_CATALOG.map((recipe) => {
    const totalNeeded = recipe.matchingIngredientIds.length;
    const matching = recipe.matchingIngredientIds.filter((id) =>
      selectedIngredientIds.includes(id)
    );
    const missing = recipe.matchingIngredientIds.filter(
      (id) => !selectedIngredientIds.includes(id)
    );
    const matchPct = Math.round((matching.length / totalNeeded) * 100);

    return {
      ...recipe,
      matchPct,
      matchingCount: matching.length,
      missingIds: missing,
    };
  }).sort((a, b) => b.matchPct - a.matchPct);

  // Filtered ingredients
  const filteredIngredients = INGREDIENTS_CATALOG.filter((ing) => {
    if (activeCategory === 'all') return true;
    return ing.category === activeCategory;
  });

  const categories = [
    { label: 'All Staples', value: 'all' },
    { label: 'Proteins', value: 'protein' },
    { label: 'Carbs', value: 'carb' },
    { label: 'Veggies', value: 'veggie' },
    { label: 'Flavors & Sauces', value: 'flavor' },
    { label: 'Dairy', value: 'dairy' },
  ];

  // Helper to add missing ingredients to cart
  const handleAddMissingToCart = (missingIds: string[]) => {
    const itemsToAdd = INGREDIENTS_CATALOG.filter((ing) => missingIds.includes(ing.id)).map(
      (ing) => ({
        id: `ing_cart_${ing.id}_${Date.now()}`,
        title: ing.name,
        price: ing.price,
        quantity: 1,
      })
    );
    onAddCustomBundleToCart(itemsToAdd);
  };

  // Helper to add entire pot to cart
  const handleAddPotToCart = () => {
    if (selectedIngredients.length === 0) return;
    const itemsToAdd = selectedIngredients.map((ing) => ({
      id: `ing_cart_${ing.id}_${Date.now()}`,
      title: ing.name,
      price: ing.price,
      quantity: 1,
    }));
    onAddCustomBundleToCart(itemsToAdd);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Student Meal Planner & Grocery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Dorm Chef Pot & Recipe Engine
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Drag cheap dorm ingredients into your cooking pot below. Our engine instantly analyzes what you have and suggests delicious, 10-minute student meals with exact budget breakdowns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIngredientIds(['ing_rice', 'ing_eggs', 'ing_soy_sesame'])}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
            >
              Preset: Quick Fried Rice
            </button>
            <button
              onClick={() => setSelectedIngredientIds(['ing_ramen', 'ing_eggs', 'ing_cheese'])}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors"
            >
              Preset: Creamy Ramen
            </button>
          </div>
        </div>
      </div>

      {/* Main Drag-and-Drop Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Drag-and-Drop Ingredient Shelf (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-800" />
              <span>Pantry & Produce Shelf</span>
            </h2>
            <span className="text-xs text-stone-400">Drag card or click to add</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                  activeCategory === c.value
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Draggable Ingredient Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredIngredients.map((ing) => {
              const isSelected = selectedIngredientIds.includes(ing.id);
              return (
                <div
                  key={ing.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ing.id)}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`p-3 rounded-xl border text-left cursor-grab active:cursor-grabbing transition-all select-none flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 shadow-xs ring-1 ring-amber-300'
                      : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-2xl" role="img" aria-label={ing.name}>
                      {ing.emoji}
                    </span>
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isSelected
                          ? 'bg-amber-800 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs font-bold text-stone-900 leading-tight">
                      {ing.name}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                      <span className="font-mono font-semibold text-stone-800">${ing.price.toFixed(2)}</span>
                      <span>{ing.calories} kcal</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Droppable Dorm Chef Pot (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Your Dorm Chef Pot</span>
            </h2>
            {selectedIngredients.length > 0 && (
              <button
                onClick={clearPot}
                className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Empty Pot</span>
              </button>
            )}
          </div>

          {/* Droppable Interactive Pot Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[260px] p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              isDraggingOver
                ? 'border-amber-600 bg-amber-50/70 scale-[1.01]'
                : selectedIngredients.length > 0
                ? 'border-stone-300 bg-gradient-to-b from-stone-50 to-white'
                : 'border-dashed border-stone-300 bg-stone-50/60'
            }`}
          >
            {selectedIngredients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100/60 flex items-center justify-center text-2xl text-amber-800 mb-3 animate-bounce">
                  🍲
                </div>
                <h3 className="text-sm font-bold text-stone-800">Your Cooking Pot is Empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Drag ingredients from the left or click on them to drop into your pot and unlock tailored dorm recipes!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
                  <span>
                    Simmering <strong className="text-stone-800">{selectedIngredients.length}</strong> items in pot
                  </span>
                  <span className="flex items-center gap-1 font-mono text-stone-800 font-bold">
                    Total: ${totalPotCost.toFixed(2)} · {totalPotCalories} kcal
                  </span>
                </div>

                {/* Dropped items pills */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {selectedIngredients.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 shadow-xs text-xs font-semibold text-stone-800 animate-in fade-in zoom-in-95"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                      <span className="font-mono text-stone-400">(${item.price.toFixed(2)})</span>
                      <button
                        onClick={() => toggleIngredient(item.id)}
                        className="text-stone-400 hover:text-stone-700 ml-1 p-0.5"
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions for Pot */}
            {selectedIngredients.length > 0 && (
              <div className="pt-4 mt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-stone-500">
                  Ready to cook or need these ingredients in your dorm?
                </p>
                <button
                  onClick={handleAddPotToCart}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Entire Pot to Cart (${totalPotCost.toFixed(2)})</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Tip Banner */}
          <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <p>
              <strong>Student Budget Tip:</strong> Cooking 4 dinners in your dorm with these essentials costs roughly $6.20 total compared to $48+ on campus dining hall retail.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Recipes Engine Section */}
      <div className="pt-8 border-t border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Matched Dorm Recipes ({evaluatedRecipes.length})
            </h2>
            <p className="text-xs text-stone-500">
              Sorted by how many ingredients you already have in your pot.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {evaluatedRecipes.map((rec) => {
            const isFullMatch = rec.matchPct === 100;
            const isMissingFew = rec.missingIds.length > 0 && rec.missingIds.length <= 2;

            return (
              <div
                key={rec.id}
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isFullMatch
                    ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-200'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isFullMatch
                          ? 'bg-emerald-100 text-emerald-800'
                          : isMissingFew
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isFullMatch ? '✓ Ready to Cook (100% Match)' : `${rec.matchPct}% Ingredient Match`}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {rec.cookTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">{rec.title}</h3>
                  <p className="text-xs text-amber-800 font-semibold mt-1">
                    Equip: {rec.requiredEquipment}
                  </p>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {rec.studentSecret}
                  </p>

                  {/* Required items check */}
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Ingredients ({rec.matchingCount}/{rec.matchingIngredientIds.length} in pot)
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rec.matchingIngredientIds.map((id) => {
                        const ing = INGREDIENTS_CATALOG.find((i) => i.id === id);
                        const hasIt = selectedIngredientIds.includes(id);
                        return (
                          <span
                            key={id}
                            className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 ${
                              hasIt
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            <span>{ing?.emoji}</span>
                            <span>{ing?.name.split('(')[0]}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-stone-400 block">Est. Cost</span>
                    <span className="text-sm font-extrabold text-stone-900 font-mono">
                      ${rec.estCostPerServing.toFixed(2)} <span className="text-[10px] font-normal text-stone-500">/ plate</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {rec.missingIds.length > 0 ? (
                      <button
                        onClick={() => handleAddMissingToCart(rec.missingIds)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded border border-amber-200 transition-colors"
                        title="Add missing ingredients to shopping cart"
                      >
                        + Add {rec.missingIds.length} Missing
                      </button>
                    ) : null}

                    <button
                      onClick={() => setViewingRecipe(rec)}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                    >
                      <span>Instructions</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipe Steps Modal */}
      {viewingRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 my-6">
            <button
              onClick={() => setViewingRecipe(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 rounded-full"
              aria-label="Close recipe"
            >
              ×
            </button>

            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                {viewingRecipe.difficulty} · {viewingRecipe.cookTime}
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-1">{viewingRecipe.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Cookware Needed: <strong>{viewingRecipe.requiredEquipment}</strong> · Est. Cost: ${viewingRecipe.estCostPerServing.toFixed(2)}/serving
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950">
              <strong>College Hack:</strong> {viewingRecipe.studentSecret}
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Preparation Steps
              </h4>
              <ol className="space-y-2 text-xs text-stone-700 list-decimal pl-4 leading-relaxed">
                {viewingRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Cookware match suggestion */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Don't have a skillet or rice cooker? Check cheap cookware in our marketplace.
              </span>
              <button
                onClick={() => setViewingRecipe(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
