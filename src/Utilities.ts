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

    public static quaternionToOrientation(rotationQuaternion: BABYLON.Nullable<BABYLON.Quaternion>)
    {
        const s22 = Math.sqrt(2) / 2;
        
        // BOTTOM
        if (!rotationQuaternion ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, 0,  1)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, 0, -1)))
            return new Orientation(Face.BOTTOM, 0);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0,  s22, 0,  s22)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, -s22, 0, -s22)))
            return new Orientation(Face.BOTTOM, -Math.PI / 2);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, -1, 0, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0,  1, 0, 0)))
            return new Orientation(Face.BOTTOM, Math.PI);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, -s22, 0,  s22)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0,  s22, 0, -s22)))
            return new Orientation(Face.BOTTOM, Math.PI / 2);

        // TOP
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, -1, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0,  1, 0)))
            return new Orientation(Face.TOP, 0);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-s22, 0, -s22, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( s22, 0,  s22, 0)))
            return new Orientation(Face.TOP, Math.PI / 2);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-1, 0, 0, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( 1, 0, 0, 0)))
            return new Orientation(Face.TOP, Math.PI);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( s22, 0, -s22, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-s22, 0,  s22, 0)))
            return new Orientation(Face.TOP, -Math.PI / 2);

        // RIGHT
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-s22, 0, 0,  s22)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( s22, 0, 0, -s22)))
            return new Orientation(Face.RIGHT, 0);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5,  .5,  .5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5, -.5, -.5, -.5)))
            return new Orientation(Face.RIGHT, Math.PI / 2);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, -s22, -s22, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0,  s22,  s22, 0)))
            return new Orientation(Face.RIGHT, Math.PI);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5, -.5, -.5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5,  .5,  .5, -.5)))
            return new Orientation(Face.RIGHT, -Math.PI / 2);

        // LEFT
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(s22, 0, 0, s22)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-s22, 0, 0, -s22)))
            return new Orientation(Face.LEFT, 0);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5,  .5, -.5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5, -.5,  .5, -.5)))
            return new Orientation(Face.LEFT, Math.PI / 2);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0,  s22, -s22, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, -s22,  s22, 0)))
            return new Orientation(Face.LEFT, Math.PI);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5, -.5,  .5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5,  .5, -.5, -.5)))
            return new Orientation(Face.LEFT, -Math.PI / 2);

        // BACK
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, -s22, s22)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, s22, -s22)))
            return new Orientation(Face.BACK, 0);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5,  .5, -.5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5, -.5,  .5, -.5)))
            return new Orientation(Face.BACK, Math.PI / 2);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( s22, -s22, 0, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-s22,  s22, 0, 0)))
            return new Orientation(Face.BACK, Math.PI);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5, -.5, -.5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5,  .5,  .5, -.5)))
            return new Orientation(Face.BACK, -Math.PI / 2);

        // FRONT
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, s22, s22)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(0, 0, -s22, -s22)))
            return new Orientation(Face.FRONT, 0);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5,  .5,  .5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5, -.5, -.5, -.5)))
            return new Orientation(Face.FRONT, Math.PI / 2);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( s22,  s22, 0, 0)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-s22, -s22, 0, 0)))
            return new Orientation(Face.FRONT, Math.PI);
        if (this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion(-.5, -.5,  .5,  .5)) ||
            this.isAboutEqualToQ(rotationQuaternion, new BABYLON.Quaternion( .5,  .5, -.5, -.5)))
            return new Orientation(Face.FRONT, -Math.PI / 2);

        return new Orientation(Face.UNKNOWN, 0);
    }

    public static isAboutEqualToQ(vector4A: BABYLON.Quaternion,
        vector4B: BABYLON.Quaternion,
        epsilon: number = 0.00001
    ) : boolean
    {
        return this.isAboutEqualTo(vector4A.x, vector4B.x, epsilon)
            && this.isAboutEqualTo(vector4A.y, vector4B.y, epsilon)
            && this.isAboutEqualTo(vector4A.z, vector4B.z, epsilon)
            && this.isAboutEqualTo(vector4A.w, vector4B.w, epsilon);
    }

    public static isAboutEqualToV3(vector3A: BABYLON.Vector3,
        vector3B: BABYLON.Vector3,
        epsilon: number = 0.00001
    ) : boolean
    {
        return this.isAboutEqualTo(vector3A.x, vector3B.x, epsilon)
            && this.isAboutEqualTo(vector3A.y, vector3B.y, epsilon)
            && this.isAboutEqualTo(vector3A.z, vector3B.z, epsilon);
    }

    public static isAboutEqualTo(numberA: number,
        numberB: number,
        epsilon: number = 0.00001
    ) : boolean
    {
        return Math.abs(numberA - numberB) < epsilon;
    }
}

export enum Axis
{
    X = "X",
    Y = "Y",
    Z = "Z"
}

export enum Face
{
    BOTTOM = "BOTTOM",
    TOP = "TOP",
    RIGHT = "RIGHT",
    LEFT = "LEFT",
    FRONT = "FRONT",
    BACK = "BACK",
    UNKNOWN = "UNKNOWN"
}

// 6 faces x 4 rotations = 24 possible orientations
export class Orientation
{
    faceOnFloor: Face;
    rotation: number;

    constructor(faceOnFloor: Face, rotation: number)
    {
        this.faceOnFloor = faceOnFloor;
        this.rotation = rotation;
    }
}