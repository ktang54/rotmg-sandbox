import { TextureMap } from "../engine/asset/TextureAssetLoader";
import Rect from "../engine/logic/Rect";
import { GLSprite } from "../engine/obj/GameObject";
import { Action, Direction, Sprite } from "./asset/atlas/Spritesheet";
import RotMGAssets from "./asset/RotMGAssets";
import Texture from "./data/Texture";
import XMLObject from "./data/XMLObject";

export default class RenderHelper {
	assets: RotMGAssets;
	textures: TextureMap;
	
	constructor(assets: RotMGAssets, textures: TextureMap) {
		this.assets = assets;
		this.textures = textures;
	}

	getSpriteFromTexture(textureData: Texture | undefined, direction = Direction.Front, action = Action.Walk) {
		if (textureData === undefined) return undefined;
		let sprite: Sprite | undefined;
		if (textureData.animated) {
			sprite = this.assets.spritesheetManager.getAnimatedSpriteFromTexture(textureData, direction, action);
		} else {
			sprite = this.assets.spritesheetManager.getSpriteFromTexture(textureData);
		}

		if (sprite === undefined) return undefined;
		const texture = this.textures.get(this.assets.spritesheetManager.atlasNameFromId(sprite.atlasId));
		if (texture === undefined) return undefined;
		return {
			texture, 
			rect: this.fromSprite(sprite)
		}
	}

	getSpriteFromObject(obj: XMLObject | undefined, direction = Direction.Front, action = Action.Walk): GLSprite | undefined {
		if (obj === undefined) return undefined;
		return this.getSpriteFromTexture(obj.texture);
	}

	getSpritesFromObject(obj: XMLObject | undefined, direction = Direction.Front, action = Action.Walk): GLSprite[] {
		if (obj === undefined || obj.texture === undefined) return [];
		let sprites: (Sprite | undefined)[];
		if (obj.texture.animated) {
			sprites = this.assets.spritesheetManager.getAnimatedSpritesFromTexture(obj.texture, direction, action);
		} else {
			sprites = [this.assets.spritesheetManager.getSpriteFromTexture(obj.texture)]
		}

		const glSprites: GLSprite[] = [];
		for (let sprite of sprites) {
			if (sprite === undefined) continue;
			const texture = this.textures.get(this.assets.spritesheetManager.atlasNameFromId(sprite.atlasId));
			if (texture === undefined) continue;
			glSprites.push({
				rect: this.fromSprite(sprite),
				texture
			})
		}
		return glSprites;
	}

	fromSprite(sprite: Sprite) {
		return new Rect(sprite.position.x, sprite.position.y, sprite.position.w, sprite.position.h);
	}
}