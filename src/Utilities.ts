import * as BABYLON from '@babylonjs/core'

export class Utilities
{
    public static sleep(ms: number) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static toSign(booleanSign: boolean): number
    {
        return booleanSign ? 1 : -1;
    }

    public static getIdentityVector(axis: Axis): BABYLON.Vector3
    {
        switch (axis)
        {
            case Axis.X:
                return new BABYLON.Vector3(1, 0, 0);
            case Axis.Y:
                return new BABYLON.Vector3(0, 1, 0);
            case Axis.Z:
                return new BABYLON.Vector3(0, 0, 1);
        }
    }

    public static getRotationVector(axis: Axis): BABYLON.Vector3
    {
        switch (axis)
        {
            case Axis.X:
                return new BABYLON.Vector3(0, 0, 1);
            case Axis.Y:
                return new BABYLON.Vector3(0, 1, 0);
            case Axis.Z:
                return new BABYLON.Vector3(1, 0, 0);
        }
    }

    public static getRotationSign(axis: Axis): number
    {
        switch (axis)
        {
            case Axis.X:
                return -1;
            case Axis.Y:
                return 0
            case Axis.Z:
                return 1;
        }
    }
}

export enum Axis
{
    X,
    Y,
    Z
}